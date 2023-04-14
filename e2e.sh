#! /bin/sh

testEquality() {
  RES=$(cat < test/result.json | jq)
  EXP=$(node dist/index.js --out json | jq)
  assertEquals "${EXP}" "${RES}"
}

# Load shUnit2.
. /usr/share/shunit2/shunit2

