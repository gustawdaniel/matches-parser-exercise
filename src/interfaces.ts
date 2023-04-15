import {z} from "zod";

export const MatchModel = z.object({
    sport: z.enum(['soccer', 'tennis', 'volleyball', 'basketball', 'handball']),
    participant1: z.string(),
    participant2: z.string(),
});

export type Match = z.infer<typeof MatchModel>;
export type SportType = Match['sport'];

export const StringScoreModel = z.string();
export const ArrayScoreModel = z.array(z.string().array().length(2));

