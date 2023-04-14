import matches from './matches.json'
import {playsResults} from "./playsResults";

const out = playsResults(matches);

if(process.argv[2] === '--out' && process.argv[3] === 'json') {
    console.log(JSON.stringify(out, null, 2));
} else {
    console.log(out)
}
