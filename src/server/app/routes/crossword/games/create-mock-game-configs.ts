import { CrosswordGameConfigs } from "../../../common/communication/game-configs";

export function createMockGameConfigs(): CrosswordGameConfigs {
    const gameModes = ['classic', 'dynamic'];
    const playerNumbers = ['1', '2'];
    const createJoinChoices = ['create', 'join'];
    const difficulties = ['easy', 'normal', 'brutal'];

    const randGameMode = gameModes[Math.floor(Math.random() * gameModes.length)];
    const randPlayerNumber = playerNumbers[Math.floor(Math.random() * playerNumbers.length)];
    const randCreateJoin = createJoinChoices[Math.floor(Math.random() * createJoinChoices.length)];
    const randDifficulty = difficulties[Math.floor(Math.random() * difficulties.length)];

    const config: CrosswordGameConfigs = {
        gameMode: randGameMode,
        playerNumber: randPlayerNumber,
        createJoin: randCreateJoin,
        difficulty: randDifficulty
    };
    return config;
}