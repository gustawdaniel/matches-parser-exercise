import {z} from "zod";
import {EventParser} from "./EventParser";

interface MatchResult {
    name: string;
    score: string;
}

export function playsResults(unknownMatches: unknown): MatchResult[] {
    const matches = z.array(z.unknown()).safeParse(unknownMatches);
    if(!matches.success) { return []; }
    return matches.data.map(match => {
        try {
            return {
                name: EventParser.makeEventName(match),
                score: EventParser.formatScore(match)
            }
        } catch (e) {
            // Silent fail
            return null;
        }
    }).filter((match): match is MatchResult => Boolean(match))
}
