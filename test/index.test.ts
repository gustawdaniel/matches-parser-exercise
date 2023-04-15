import {matchesResults} from "../src/matchesResults";
import {ScoredMatch} from "../src/EventParser";
import matches from "../src/matches.json";
import result from "./result.json";
import {ScoreFormatter} from "../src/ScoreFormatter";
import {ZodError} from "zod";

describe('playsResults', () => {
    it('e2e', () => {
        expect(matchesResults(matches)).toEqual(result)
    });

    it('i can override maps with config', () => {
        const input: ScoredMatch[] = [{sport: 'basketball', participant1: 'me', participant2: 'you', score: 'only me'}]
        expect(matchesResults(input, {
            // my custom join
            joinMap: new Map([['basketball', '/']]),
            // my custom score formatter
            scoreMap: new Map([['basketball', (score) => typeof score === 'string' && /me/.test(score) ? '1:0' : '0:1']])
        })).toEqual([{
            name: 'me / you',
            score: '1:0'
        }]);
    });

    it('garbage in', () => {
        expect(matchesResults(new Date(NaN))).toEqual([])
    });

    it('basketball score', () => {
        expect(new ScoreFormatter().formatArrayScore([['1', '2'], ['3', '4']])).toEqual('1,2,3,4')
    });

    it('tennis score', () => {
        expect(new ScoreFormatter().formatSetsStringScore('1:2,3:4,5:6,7:8')).toEqual('Main score: 1:2 (set1 3:4, set2 5:6, set3 7:8)')
    });

    it('single volleyball set', () => {
        expect(new ScoreFormatter('volleyball').formatSetsStringScore('1:0,21:11')).toEqual('Main score: 1:0 (set1 21:11)')
    })

    it('4 tennis sets (not possible game)', () => {
        expect(() => {
            new ScoreFormatter('tennis').formatSetsStringScore('2:2,1:2,1:2,2:1,2:1');
        }).toThrow(new ZodError([{
            code: 'custom',
            message: 'Tennis can have 2, 3 or 5 sets',
            path: []
        }]));
    });

    it('soccer score', () => {
        expect(new ScoreFormatter().formatIdentityStringScore('1:2')).toEqual('1:2')
    });
})
