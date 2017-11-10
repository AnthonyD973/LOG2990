import { Game } from './game';
import { PacketHandler, PacketEvent, registerHandlers } from '../../../../../common/src/index';
import { TimerPacket } from '../../../../../common/src/crossword/packets/timer.packet';
import { CrosswordGameConfigs } from '../../../../../common/src/communication/game-configs';
import { PacketManagerServer } from '../../../packet-manager';

export class GameDynamic extends Game {

    private static readonly COUNTDOWN_INITAL = 3600; // 1 hour

    private countdown = GameDynamic.COUNTDOWN_INITAL;
    protected timerInterval: NodeJS.Timer = null;

    constructor(configs: CrosswordGameConfigs) {
        super(configs);
        registerHandlers(this, PacketManagerServer.getInstance());
    }

    public deletePlayerBySocketid(socketId: string): void {
        const index =
            this.players.findIndex((existingPlayer) => existingPlayer.socketId === socketId);
        const found = index >= 0;
        if (found) {
            this.stopTimer();
        }
        super.deletePlayerBySocketid(socketId);
    }

    protected start(): void {
        // Reset timer
        this.stopTimer();
        this.startTimer();

        super.start();
    }

    protected startTimer() {
        if (this.timerInterval === null) {
            const ONE_SECOND = 1000; // ms
            this.timerInterval = setInterval(() => {
                this.countdown--;
                this.players.forEach((player) => {
                    this.communicationHandler.sendNewTimerValueTo(player, this.countdown);
                });
            }, ONE_SECOND);
        }
    }

    protected stopTimer(): void {
        if (this.timerInterval !== null) {
            // Stop countdown
            this.players.forEach(player => {
                this.communicationHandler.sendNewTimerValueTo(player, 0);
            });
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    @PacketHandler(TimerPacket)
    // tslint:disable-next-line:no-unused-variable
    private getCheatModeTimerValue(event: PacketEvent<TimerPacket>) {
        if (this.isSocketIdInGame(event.socketid)) {
            this.countdown = event.value.countdown;
        }
    }

}
