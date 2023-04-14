import { playsResults} from "../src/playsResults";
import {EventParser} from "../src/EventParser";
import matches from "../src/matches.json";

describe('playsResults', () => {
    it('e2e', () => {
        expect(playsResults(matches)).toEqual([
                {name: 'Chelsea - Arsenal', score: '2:1'},
                {
                    name: 'Germany - France',
                    score: 'Main score: 3:0 (set1 25:23, set2 25:19, set3 25:21)'
                },
                {name: 'Pogoń Szczeciń vs Azoty Puławy', score: '34:26'},
                {name: 'GKS Tychy - GKS Katowice', score: '9:7,2:1,5:3,9:9'},
                {
                    name: 'Maria Sharapova vs Serena Williams',
                    score: 'Main score: 2:1 (set1 7:6, set2 6:3, set3 6:7)'
                }
            ]
        )
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
