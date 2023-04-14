import {matchesResults} from "../src/matchesResults";
import {ScoredMatch, ScoreFormatter} from "../src/EventParser";
import matches from "../src/matches.json";
import result from "./result.json";

describe('playsResults', () => {
    it('e2e', () => {
        expect(matchesResults(matches)).toEqual(result)
    })

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
        }])
    })

    it('garbage in', () => {
        expect(matchesResults(new Date(NaN))).toEqual([])
    })

    it('basketball score', () => {
        expect(ScoreFormatter.formatArrayScore([['1', '2'], ['3', '4']])).toEqual('1,2,3,4')
    })

    it('tennis score', () => {
        expect(ScoreFormatter.formatSetsStringScore('1:2,3:4,5:6,7:8')).toEqual('Main score: 1:2 (set1 3:4, set2 5:6, set3 7:8)')
    })

    it('soccer score', () => {
        expect(ScoreFormatter.formatIdentityStringScore('1:2')).toEqual('1:2')
    });
})
