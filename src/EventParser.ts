import {z} from "zod";

const MatchModel = z.object({
    sport: z.enum(['soccer', 'tennis', 'volleyball', 'basketball', 'handball']),
    participant1: z.string(),
    participant2: z.string(),
});

const StringScoreModel = z.string();
const ArrayScoreModel = z.array(z.string().array().length(2));

const ScoredMatchModel = MatchModel.extend({
    score: z.union([StringScoreModel, ArrayScoreModel])
});

type Match = z.infer<typeof MatchModel>;
type SportType = Match['sport'];
export type ScoredMatch = z.infer<typeof ScoredMatchModel>;

export class ScoreFormatter {
    static formatIdentityStringScore(unknownScore: unknown): string {
        return StringScoreModel.parse(unknownScore);
    }

    static formatSetsStringScore(unknownScore: unknown): string {
        const score = StringScoreModel.parse(unknownScore);
        const scores = score.split(',');
        if (scores && scores.length > 3 && scores.every(s => /^[0-9]+:[0-9]+$/.test(s))) {
            return `Main score: ${scores[0]} (set1 ${scores[1]}, set2 ${scores[2]}, set3 ${scores[3]})`;
        } else {
            throw new Error("Exception: invalid score");
        }
    }

    static formatArrayScore(unknownScore: unknown): string {
        const score = ArrayScoreModel.parse(unknownScore);
        return score.flat().join(',');
    }
}

export interface EventParserConfig {
    joinMap?: Map<SportType, string>;
    scoreMap?: Map<SportType, (unknownScore: unknown) => string>;
}

export class EventParser {
    private readonly joinMap: Map<SportType, string>;
    private readonly scoreMap: Map<SportType, (unknownScore: unknown) => string>;

    private static defaultJoinMap() {
        const vsSports: SportType[] = ['tennis', 'handball'];
        const dashSports: SportType[] = ['soccer', 'volleyball', 'basketball'];

        const joinMap = new Map<SportType, string>();
        vsSports.forEach(vs => joinMap.set(vs, 'vs'));
        dashSports.forEach(vs => joinMap.set(vs, '-'));
        return joinMap;
    }

    private static defaultScoreMap() {
        return new Map<SportType, (unknownScore: unknown) => string>([
            ['soccer', ScoreFormatter.formatIdentityStringScore],
            ['tennis', ScoreFormatter.formatSetsStringScore],
            ['volleyball', ScoreFormatter.formatSetsStringScore],
            ['basketball', ScoreFormatter.formatArrayScore],
            ['handball', ScoreFormatter.formatIdentityStringScore],
        ]);
    }

    constructor(config: EventParserConfig) {
        this.joinMap = config.joinMap || EventParser.defaultJoinMap();
        this.scoreMap = config.scoreMap || EventParser.defaultScoreMap();
    }

    makeEventName(unknownMatch: unknown): string {
        const match = MatchModel.parse(unknownMatch);
        if (this.joinMap.has(match.sport)) {
            return `${match.participant1} ${this.joinMap.get(match.sport)} ${match.participant2}`;
        } else {
            throw new Error("Exception: invalid sport");
        }
    }

    formatScore(unknownMatch: unknown): string {
        const match = ScoredMatchModel.parse(unknownMatch);
        const formatter = this.scoreMap.get(match.sport);
        if (formatter) {
            return formatter(match.score)
        } else {
            throw new Error("Exception: invalid sport");
        }
    }
}
