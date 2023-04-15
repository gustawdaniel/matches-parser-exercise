[![Node.js CI](https://github.com/gustawdaniel/matches-parser-exercise/actions/workflows/node.js.yml/badge.svg)](https://github.com/gustawdaniel/matches-parser-exercise/actions/workflows/node.js.yml)

# Refactoring challenge

- You have to refactor code in app.js file. Change it, split it, improve it, do it your own way!
- You can use version of node you prefer
- Code was tested in node 6, 10, 12, 14, 16, so it should be quite version agnostic at this stage
- Application should print out the array of parsed events:

```javascript
[
    {
        name: 'Chelsea - Arsenal',
        score: '2:1'
    },
    {
        name: 'Germany - France',
        score: 'Main score: 3:0 (set1 25:23, set2 25:19, set3 25:21)'
    },
    {
        name: 'Pogoń Szczeciń vs Azoty Puławy',
        score: '34:26'
    },
    {
        name: 'GKS Tychy - GKS Katowice',
        score: '9:7,2:1,5:3,9:9'
    },
    {
        name: 'Maria Sharapova vs Serena Williams',
        score: 'Main score: 2:1 (set1 7:6, set2 6:3, set3 6:7)'
    }
]
```

- Structure of matches data should stay intact (that doesn't mean you can't move it around tho!)
- You can stick to JS, or use TypeScript as well (it is event better, because we mostly work with TS)
- We strongly recommend to write some unit tests!

Good luck!

## What is this

Project is a simple application that parses matches from different sports and prints out array of parsed events.

## How it works

Matches are placed in file `src/matches.json`

During parsing, we:

- join name of teams participating in match
- convert score to human-readable format

Result is printed as array of objects with `name` and `score` properties.

## How to run

You can start application typing

```bash
npm install
npm run start
```

To test code with coverage, you can use

```bash
npm run test
```

and to check e2e test on built install `jq` and `shunit2`, then run

```bash
npm run build
./e2e.sh
```

By default, app print javascript objects, but you can add `--out json` to see json output that is easier in further
processing. You can also add `--stdin` to read matches from stdin instead of `src/matches.json`. Only condition:
input have to be valid json.

```bash
cat < src/matches.json | jq | npx tsx src/index.ts --stdin
```

## What was done during refactoring

- [x] Code and data were split into separate files
- [x] Zod was used to validate input data
- [x] Tests in `jest` and `shunit2` were added
- [x] Code was rewritten to TypeScript
- [x] Flag `--out json` was added to simplify output processing
- [x] GitHub Actions were added to run tests on every push
- [x] Little duplication was removed
- [x] Input file - `src/index.ts` is minimal
- [x] ESM was added and works with jest and TypeScript
- [x] Parser can be configured by overriding default maps with participants and score formatters
- [x] You can read matches from stdin instead static file
- [x] Validation rules add on number of sets (after night)
- [x] App is extendable on other types of validators and formatters
- [x] Option to build normalized model of Match was rejected. Reason: lacking knowledge about scores structure in different games

We lost support for node 6 and 10, but these platforms are not supported anymore, so it is not a big deal.

## What can be next improvements

It is project for fun, but in real projects there are few topics to cover

### Error handling

I assumed that desired approach to errors are silent fails. In real world it is good approach for some cases, but
I can imagine client asking about lost data and loosing trust to this app. We have to discuss with him what is
the best approach in this case, and it depends heavily on the context in which this app is used.

### Optimization

I didn't focus on performance, but it is good to keep in mind that we can improve it. For example, we can
profile app and find out that we are spending too much time on parsing, so we can try to optimize it. We can
also measure constrains by building big files with data and see how it works. Especially stdin and stout can
be rewritten to work with streams, so we can process data in chunks and not wait for whole file to be read.

### Employing of Artificial Intelligence

This task can be solved by AI, so if there is more complicated rules of parsing and data still evolving, we can
refactor it replacing current code by AI model. It math perfectly because we have well, defined input and output,
so we can learn model on them and expect generalisations that save time both for us and client.

## About tech stack

- `shunit2` - it is a simple bash unit test framework, that allow us to test final build using node
- `jest` - best javascript unit test framework with great typescript support
- `zod` - library for validating data, that allow to infer types from validators
- `tsx` - fastest runner than `ts-node`
- `esbuild` - fastest bundler than `tsc`
- `esbuild-jest` - fastest jest transformer than `ts-jest`

## Update

Before going sleep I asked myself about number of sets in volleyball game and decided to check it next day.

**How many sets are in a volleyball game?**

> This really depends on the context of the game however, I have found 3.5 common patterns.
>
> Best of 5. This means there is a minimum of 3 sets and a maximum of 5 sets. Essentially, the game continues until a
> team has won 3 sets. This is the style for most high school and college matches during their league play.
>
> Best of 3. Very similar idea to best of 5 but now it's a minimum of 2 sets and a maximum of 3 sets. This is the style
> for most tournaments because with teams expected to play multiple games in a day, it speeds up the process, induces less
> variability in timing, and means players don't die after 3–4 matches.
>
> Exactly 3. This means that regardless of who wins which sets, all 3 sets are played. I most often see this with the
> really young ages (12s and below) because at that age the outcome doesn't really matter and the extra set is just extra
> practice for future years. I also see this pretty frequently in adult leagues because everyone just wants their money's
> worth and wants to have fun. It also decreases timing variability.
>
> Exactly 1. I have only seen this very few times and only played it once. It is usually a tie-breaker format in a
> tournament when 1 team will move up to the gold bracket in playoffs and 1 team will move down to a lower bracket in
> playoffs.
>
> As you can see it really depends on who sets up the game and what they want.

https://www.quora.com/How-many-sets-are-in-a-volleyball-game

Using prompts:

- I have query and answer below, I need exact set of possible numbers of sets

and

- give me exact number of sets possible in tennis games using knowledge presented below

on article

https://mytennishq.com/how-many-sets-are-played-in-tennis/

I extracted rules:

- Volleyball -> 3, 2, 1, or 5 sets
- Tennis -> 3, 2, or 5 sets

Then was thinking how to validate them correctly.

I could take approach that wen have three states of matches:

1. source
2. normalized
3. parsed

But it is not clear what is normalised structure of scores, so to keep it simple I decided to add validation only 
to sets.
