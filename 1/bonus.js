const { indexOf, range, repeat, compose, map, curry, join } = require('ramda')

const LETTERS = 'abcdefghijklmnopqrstuvwxyz'.toUpperCase()
const getLetterIndex = (letter) => LETTERS.indexOf(letter)
const clampIndex = (maxIndex, index) => 
  index > maxIndex ? maxIndex-(index % maxIndex || maxIndex) : index
const printPreSpaces = curry((maxIndex, index) => repeat(' ', maxIndex - index).join(''))
const printLetter = (index) => LETTERS[index]
const printMidSpaces = (index) => repeat(' ', index*2-1).join('')
const printLine = curry((maxIndex, index, clampedIndex = clampIndex(maxIndex, index)) =>
   [printPreSpaces(maxIndex), printLetter]
    .concat(clampedIndex > 0 ? [printMidSpaces, printLetter] : [])
    .map((fn) => fn(clampedIndex))
    .join(''))
const solveByIndex = (maxIndex) => 
  compose(join('\n'), map(printLine(maxIndex)), range(0))(maxIndex*2+1)
const functional = compose(solveByIndex, getLetterIndex)

console.log(functional('C'))
const iterative = (letter) => {
  const letters = 'abcdefghijklmnopqrstuvwxyz'.toUpperCase()
  const index = letters.indexOf(letter)
  var output = ''
  for (var i=0; i<index*2+1; i++) {
    const ri = i>index ? index-(i % index || index) : i
    for (var j=0; j<index-ri; j++) {
      output += ' '
    }
    output += letters[ri]
    if (ri !== 0) {
      for (var j=0; j<ri*2-1; j++) {
        output += ' '
      }
      output += letters[ri]
    }
    output += '\n'
  }
  return output
}