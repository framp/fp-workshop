const { curry, compose, 
        split, join, splitEvery, equals,
        map, init, tail, findIndex, transpose } = require('ramda')
const fs = require('fs')
const WIDTH = 3
const HEIGHT = 3
// NUMBERS :: Line
const NUMBERS = compose(tail, split('\n'))(`
 _     _  _     _  _  _  _  _ 
| |  | _| _||_||_ |_   ||_||_|
|_|  ||_  _|  | _||_|  ||_| _|
`)
// writeFile :: String -> String -> IO ()
const writeFile = curry((file, content) => fs.writeFileSync(file, content, 'utf8'))
// readFile :: String -> IO (String)
const readFile = curry((file) => fs.readFileSync(file, 'utf8'))
// parseMatrix :: [String] -> Int
const parseCell = (cell) => findIndex(equals(cell), getNumberStrings(NUMBERS))
// getNumberStrings :: Line -> [String]
const getNumberStrings = compose(map(join('')), transpose, map(splitEvery(WIDTH)), init)
// parseLine :: Line -> [Int]
const parseLine = compose(join(''), map(parseCell), getNumberStrings)
// parse :: String -> String
const parse = compose(join('\n'), map(parseLine), splitEvery(HEIGHT+1), split('\n'))
// main :: IO ()
const main = compose(writeFile('treasure.txt'), parse, readFile)('l33t.txt')