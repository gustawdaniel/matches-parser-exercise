import {z} from "zod";
import {ArrayScoreModel, SportType, StringScoreModel} from "./interfaces";

const VolleyballSetsModel = z.array(z.string()).refine((val) => {
    return [1, 2, 3, 5].includes(val.length);
}, {message: 'Volleyball can have 1, 2, 3 or 5 sets'});

const TennisSetsModel = z.array(z.string()).refine((val) => {
    return [2, 3, 5].includes(val.length);
}, {message: 'Tennis can have 2, 3 or 5 sets'});

interface ScoreFormatterConfig {
    setsValidators: Map<SportType, (sets: string[]) => void>
}

export class ScoreFormatter {
    private readonly setsValidators: Map<SportType, (sets: string[]) => void>
    private readonly sport?: SportType;

    constructor(sport?: SportType, config?: ScoreFormatterConfig) {
        this.sport = sport;
        this.setsValidators = config?.setsValidators || this.defaultScoreValidators();
    }

    private defaultScoreValidators(): Map<SportType, (sets: string[]) => void> {
        return new Map([
            ['tennis', (score) => TennisSetsModel.parse(score)],
            ['volleyball', (score) => VolleyballSetsModel.parse(score)]
        ])
    }

    public formatIdentityStringScore(unknownScore: unknown): string {
        return StringScoreModel.parse(unknownScore);
    }

    public formatSetsStringScore(unknownScore: unknown): string {
        const score = StringScoreModel.parse(unknownScore);
        const [scores, ...sets] = score.split(','); // 3, 2, 1, or 5

        if(this.sport && this.setsValidators.has(this.sport)) {
            const validator = this.setsValidators.get(this.sport)!;
            validator(sets);
        }

        if (scores && scores.length && [scores, ...sets].every(s => /^[0-9]+:[0-9]+$/.test(s))) {
            return `Main score: ${scores} (${sets.map((set, index) => `set${index + 1} ${set}`).join(', ')})`;
        } else {
            throw new Error("Exception: invalid score");
        }
    }

    public formatArrayScore(unknownScore: unknown): string {
        const score = ArrayScoreModel.parse(unknownScore);
        return score.flat().join(',');
    }
}
