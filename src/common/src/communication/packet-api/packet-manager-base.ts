import { Constructor, toArrayBuffer, Class } from '../../utils';
import { PacketParser } from './packet-parser';
import { PacketHandler, registerParsers, registerHandlers } from './packet-handler';
import { PacketEvent } from './packet-event';

export declare type Listener = (...args: any[]) => void;
export declare type On = (event: string, listener: Function | Listener) => { on: On };
export declare interface Socket {
    id: string;
    on: On;
    send: (...argv: any[]) => this;
}

/**
 * @class
 * @description The base class that is extended by PacketManagerClient and PacketManagerServer
 */
export abstract class PacketManagerBase<Sock extends Socket> {
    private static readonly PACKET_MESSAGE_MATCHER = /^packet:([a-zA-Z_][a-zA-Z0-9_$]*)$/i;
    protected parsers: Map<Constructor<any>, PacketParser<any>> = new Map();
    private handlers: Map<Constructor<any>, PacketHandler<any>[]> = new Map();

    private static isPacketMessage(message: string): boolean {
        return PacketManagerBase.PACKET_MESSAGE_MATCHER.test(message);
    }

    private static getEventType(message: string): string | null {
        const EVENT_TYPE_GROUP_ID = 1;
        if (PacketManagerBase.isPacketMessage(message)) {
            return message.match(PacketManagerBase.PACKET_MESSAGE_MATCHER)[EVENT_TYPE_GROUP_ID];
        }
        return null;
    }

    /**
     * Must be called at the end of the child class' constructor
     */
    protected register() {
        registerParsers(this);
        registerHandlers(this);
    }

    /**
     * Add on the socket a listener to packet messages of the type parsed by the parser.
     * @param socket A socket from which we listen a packet message.
     * @param param1 A tuple containing a parser and the type of object it parses.
     */
    protected registerParsersToSocket(socket: Sock) {
        const messageHandler = (message: string, data: string) => {
            if (PacketManagerBase.isPacketMessage(message)) {
                const eventType = PacketManagerBase.getEventType(message);
                let dataType: Constructor<any>, parser: PacketParser<any>;
                if (this.hasEventType(eventType) &&
                    ([dataType, parser] = this.getParser(eventType)) !== null) {
                    console.log(`[Packet] Reception "${eventType}"`);
                    try {
                        const object = parser.parse(toArrayBuffer(data));
                        this.callHandlers(dataType, new PacketEvent(object, socket.id));
                    } catch (error) {
                        console.warn(`[Packet] An error occured while parsing ${eventType}: `,
                            error instanceof Error ? error.message : error);
                    }
                } else {
                    console.warn(`No parser for packet with "${eventType}" type. Packet dropped`);
                }
            }
        };
        socket.on('message', messageHandler);
    }

    private hasEventType(eventType: string): boolean {
        for (const [dataType] of this.parsers) {
            if (dataType.name === eventType) {
                return true;
            }
        }
        return false;
    }

    private getParser(dataType: string): [Constructor<any>, PacketParser<any>] {
        for (const parserEntry of this.parsers) {
            if (parserEntry[0].name === dataType) {
                return parserEntry;
            }
        }
        return null;
    }

    private callHandlers<T>(dataType: Constructor<T>, event: PacketEvent<T>) {
        const HANDLERS = (this.handlers.get(dataType) || []) as PacketHandler<T>[];
        for (const HANDLER of HANDLERS) {
            HANDLER(event);
        }
    }

    /**
     * Register a handler that will be called when receiving a packet of the given type.
     * @param type The data type of the object the handler can handle.
     * @param handler A function that will be called when receiveing a message of the given type.
     */
    public registerHandler<T>(type: Constructor<T>, handler: PacketHandler<T>): void {
        console.log(`[Packet] New handler for ${type.name} [${handler.name}]`);
        const handlerList = this.handlers.get(type) || [];
        handlerList.push(handler);
        console.log(handlerList);
        this.handlers.set(type, handlerList);
    }

    /**
     * Send a packet of data to a given destination.
     * @param type The type of the data to send. A parser for that type must have been registered beforehand.
     * @param data The actual data to send.
     * @param socketid (For server side only) The id of the connection to send the data to.
     * @returns True if the packet was succesfully sent, false otherwise (no matching parser, connection error, ...).
     */
    public abstract sendPacket<T>(type: Class<T>, data: T, socketid: string): boolean;

    /**
     * Register a parser for a given type of object.
     * @param type The type of data the parser can parse.
     * @param parser An instance of a class extending PacketParser and implements parse and serialize.
     */
    public registerParser<T>(type: Constructor<T>, parser: PacketParser<T>) {
        console.log(`[Packet] Registering parser for ${type.name}`);
        this.parsers.set(type, parser);
    }
}
