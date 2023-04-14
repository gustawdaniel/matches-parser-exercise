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

export class EventParser {
    static makeEventName(unknownMatch: unknown): string {
        const match = MatchModel.parse(unknownMatch);

        const vsSports: SportType[] = ['tennis', 'handball'] ;
        const dashSports: SportType[] = ['soccer', 'volleyball', 'basketball'] ;

        if (vsSports.includes(match.sport)) {
            return `${match.participant1} vs ${match.participant2}`;
        } else if (dashSports.includes(match.sport)) {
            return `${match.participant1} - ${match.participant2}`;
        } else {
            throw new Error("Exception: invalid sport");
        }

    }

    static formatIdentityStringScore(unknownScore: unknown): string {
        return StringScoreModel.parse(unknownScore);
    }

    static formatSetsStringScore(unknownScore: unknown): string {
        const score = StringScoreModel.parse(unknownScore);
        const scores = /([0-9]+:[0-9]+),([0-9]+:[0-9]+),([0-9]+:[0-9]+),([0-9]+:[0-9]+)/.exec(score);
        if(scores && scores.length > 3) {
            return `Main score: ${scores[1]} (set1 ${scores[2]}, set2 ${scores[3]}, set3 ${scores[4]})`;
        } else {
            throw new Error("Exception: invalid score");
        }

    }

    static formatArrayScore(unknownScore: unknown): string {
        const score = ArrayScoreModel.parse(unknownScore);
        return score.flat().join(',');
    }

    static formatScore(unknownMatch: unknown): string {
        const match = ScoredMatchModel.parse(unknownMatch);

        switch (match.sport) {
            case 'soccer': return EventParser.formatIdentityStringScore(match.score);
            case 'tennis': return EventParser.formatSetsStringScore(match.score);
            case 'volleyball': return EventParser.formatSetsStringScore(match.score);
            case 'basketball': return EventParser.formatArrayScore(match.score);
            case 'handball': return EventParser.formatIdentityStringScore(match.score);
            default: throw new Error("Exception: invalid sport");
        }
    }
}
