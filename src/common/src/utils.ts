export function isJson(pseudoJson: string): boolean {
    try {
        JSON.parse(pseudoJson);
        return true;
    } catch (error) {
        if (error instanceof SyntaxError) {
            return false;
        }
        throw error;
    }
}

export interface Constructor<T = any> {
    new(...argv: any[]): T;
}
export interface Class<T extends InstanceOf<any> = any> extends Function {
    prototype: T;
}

export interface InstanceOf<C extends Class<InstanceOf<C>>> {
    readonly constructor: C;
}

export interface PrototypeGetter { getPrototypeOf: <T extends InstanceOf<Class>>(obj: T) => T; }
export declare const Object: PrototypeGetter & ObjectConstructor;

export function toArrayBuffer(str: string): ArrayBuffer {
    const buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
    const bufView = new Uint16Array(buf);
    const strLen = str.length;
    for (let i = 0; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}

export function fromArrayBuffer(data: ArrayBuffer): string {
    return String.fromCharCode.apply(null, new Uint16Array(data));
}

const CALL_STACK_REGEX = /\s*at\s(.+)\s\(.+:\d+:\d+\)/;

export function getCallers(): string[] {
    const error = new Error();
    try {
        const callers = error.stack.match(new RegExp(CALL_STACK_REGEX, 'g'))
            .map((value) => value.match(CALL_STACK_REGEX)[1]);
        callers.shift();
        return callers;
    } catch (e) {
        return null;
    }
}

export function warn(logger: { warn: (message: any) => void }): (error: any) => never;
export function warn<T>(logger: { warn: (message: any) => void }, returnValue: T): (error: any) => T;
export function warn<T>(logger: { warn: (message: any) => void }, returnValue?: T) {
    return function (error: any): T {
        logger.warn(error);
        if (returnValue !== undefined) {
            return returnValue;
        }
        throw error;
    };
}

export class NotImplementedError extends Error {
    private static readonly ERROR_MESSAGE = 'Not Implemented';
    constructor(message?: string) {
        message = message ? ': ' + message : '';
        super(NotImplementedError.ERROR_MESSAGE + (message));
    }
}

export interface FunctionDescriptor {
    name: string;
    parameterCount: number;
}

export type TypeOf = 'undefined' | 'boolean' | 'number' | 'string' | 'object';
export interface NativeAttributeDescriptor {
    name: string;
    type: TypeOf;
}
export interface AttributeDescriptor {
    name: string;
    parent: Class;
}

export function hasNativeAttributes(objectToCheck: any, attributeDescriptors: NativeAttributeDescriptor[]): boolean {
    let hasAttributes = objectToCheck != null;
    for (let i = 0; i < attributeDescriptors.length && hasAttributes; ++i) {
        const FUNCTION_TO_CHECK = attributeDescriptors[i];
        hasAttributes =
            FUNCTION_TO_CHECK.name in objectToCheck &&
            typeof objectToCheck[FUNCTION_TO_CHECK.name] === FUNCTION_TO_CHECK.type;
    }
    return hasAttributes;
}

export function hasAttributes(objectToCheck: any, attributeDescriptors: AttributeDescriptor[]): boolean {
    let hasAttributes = objectToCheck != null;
    for (let i = 0; i < attributeDescriptors.length && hasAttributes; ++i) {
        const FUNCTION_TO_CHECK = attributeDescriptors[i];
        hasAttributes =
            FUNCTION_TO_CHECK.name in objectToCheck &&
            objectToCheck[FUNCTION_TO_CHECK.name] instanceof FUNCTION_TO_CHECK.parent;
    }
    return hasAttributes;
}

export function hasFunctions(objectToCheck: any, functionDescriptors: FunctionDescriptor[]): boolean {
    let hasFunctions = objectToCheck != null;
    for (let i = 0; i < functionDescriptors.length && hasFunctions; ++i) {
        const FUNCTION_TO_CHECK = functionDescriptors[i];
        hasFunctions =
            FUNCTION_TO_CHECK.name in objectToCheck &&
            objectToCheck[FUNCTION_TO_CHECK.name].length >= FUNCTION_TO_CHECK.parameterCount;
    }
    return hasFunctions;
}
