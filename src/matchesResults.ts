import {z} from "zod";
import {EventParser, EventParserConfig} from "./EventParser";

export interface MatchResult {
    name: string;
    score: string;
}

export function matchesResults(unknownMatches: unknown, config?: EventParserConfig): MatchResult[] {
    const matches = z.array(z.unknown()).safeParse(unknownMatches);
    if(!matches.success) { return []; }
    const parser = new EventParser(config || {});
    return matches.data.map(match => {
        try {
            return {
                name: parser.makeEventName(match),
                score: parser.formatScore(match)
            }
        } catch (e) {
            // Silent fail
            return null;
        }
    }).filter((match): match is MatchResult => Boolean(match))
}
