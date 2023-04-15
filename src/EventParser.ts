import {ScoreFormatter} from "./ScoreFormatter";
import {z} from "zod";
import {ArrayScoreModel, MatchModel, SportType, StringScoreModel} from "./interfaces";

export type ScoredMatch = z.infer<typeof ScoredMatchModel>;

const ScoredMatchModel = MatchModel.extend({
    score: z.union([StringScoreModel, ArrayScoreModel])
});

export interface EventParserConfig {
    joinMap?: Map<SportType, string>;
    scoreMap?: Map<SportType, (unknownScore: unknown, sport: SportType) => string>;
}

export class EventParser {
    private readonly joinMap: Map<SportType, string>;
    private readonly scoreMap: Map<SportType, (unknownScore: unknown, sport: SportType) => string>;

    private static defaultJoinMap() {
        const vsSports: SportType[] = ['tennis', 'handball'];
        const dashSports: SportType[] = ['soccer', 'volleyball', 'basketball'];

        const joinMap = new Map<SportType, string>();
        vsSports.forEach(vs => joinMap.set(vs, 'vs'));
        dashSports.forEach(vs => joinMap.set(vs, '-'));
        return joinMap;
    }

    private static defaultScoreMap() {
        return new Map<SportType, (unknownScore: unknown, sport: SportType) => string>([
            ['soccer', (unknownScore, sport) => new ScoreFormatter(sport).formatIdentityStringScore(unknownScore)],
            ['tennis', (unknownScore, sport) => new ScoreFormatter(sport).formatSetsStringScore(unknownScore)],
            ['volleyball', (unknownScore, sport) => new ScoreFormatter(sport).formatSetsStringScore(unknownScore)],
            ['basketball', (unknownScore, sport) => new ScoreFormatter(sport).formatArrayScore(unknownScore)],
            ['handball', (unknownScore, sport) => new ScoreFormatter(sport).formatIdentityStringScore(unknownScore)],
        ]);
    }

    constructor(config: EventParserConfig) {
        this.joinMap = config.joinMap || EventParser.defaultJoinMap();
        this.scoreMap = config.scoreMap || EventParser.defaultScoreMap();
    }

    private makeEventName(unknownMatch: unknown): string {
        const match = MatchModel.parse(unknownMatch);
        if (this.joinMap.has(match.sport)) {
            return `${match.participant1} ${this.joinMap.get(match.sport)} ${match.participant2}`;
        } else {
            throw new Error("Exception: invalid sport");
        }
    }

    private formatScore(unknownMatch: unknown): string {
        const match = ScoredMatchModel.parse(unknownMatch);
        const formatter = this.scoreMap.get(match.sport);
        if (formatter) {
            return formatter(match.score, match.sport);
        } else {
            throw new Error("Exception: invalid score");
        }
    }

    format(match: unknown) {
        return {
            name: this.makeEventName(match),
            score: this.formatScore(match)
        }
    }
}
