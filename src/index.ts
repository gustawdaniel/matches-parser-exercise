import matches from './matches.json'
import {MatchResult, matchesResults} from "./matchesResults";

function isJsonOut(): boolean {
    // little hack but let us avoid using a library
    return process.argv[2] === '--out' && process.argv[3] === 'json' || process.argv[3] === '--out' && process.argv[4] === 'json'
}

function format(out: MatchResult[]): string|MatchResult[] {
    return isJsonOut() ? JSON.stringify(out, null, 2) : out;
}

function isStdinInput(): boolean {
    return process.argv[2] === '--stdin' || process.argv[4] === '--stdin'
}

if (isStdinInput()) {
    process.stdin.on('data', data => {
        console.log(format(matchesResults(JSON.parse(data.toString()))));
        process.exit();
    });
} else {
    console.log(format(matchesResults(matches)))
}
