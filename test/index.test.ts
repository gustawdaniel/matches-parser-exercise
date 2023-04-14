import { playsResults} from "../src/playsResults";
import {EventParser} from "../src/EventParser";
import matches from "../src/matches.json";
import result from "./result.json";

describe('playsResults', () => {
    it('e2e', () => {
        expect(playsResults(matches)).toEqual(result)
    })

    it('garbage in', () => {
        expect(playsResults(new Date(NaN))).toEqual([])
    })

    it('basketball score', () => {
        expect(EventParser.formatArrayScore([['1', '2'], ['3', '4']])).toEqual('1,2,3,4')
    })

    it('tennis score', () => {
        expect(EventParser.formatSetsStringScore('1:2,3:4,5:6,7:8')).toEqual('Main score: 1:2 (set1 3:4, set2 5:6, set3 7:8)')
    })

    it('soccer score', () => {
        expect(EventParser.formatIdentityStringScore('1:2')).toEqual('1:2')
    });
})
