const { curry, range } = require('ramda')

const people = {
  'Jules': [120, []],
  'Vincent': [120, ['Pumpkin', 'Bonnie']],
  'Marsellus': [80, ['Gimp', 'Butch']],
  'Gimp': [60, ['Marsellus']],
  'HoneyBunny': [50, ['Vincent']],
  'Pumpkin': [50, ['Vincent', 'Jules']],
  'Butch': [100, ['Marsellus', 'Vincent', 'Gimp']],
  'Bonnie': [25, []]
}

const shoot = (people, name) => Object.assign({}, people,
  { [name]: [people[name][0] - 5, people[name][1]] })

const concatTargets = (acc, name) => 
  acc.concat(people[name][1])
const getTargets = (people) => 
  Object.keys(people).reduce(concatTargets, [])

const shootTargets = (targets, people) =>
  targets.reduce(shoot, people)
  
const targets = getTargets(people)
const nextState = shootTargets(targets, people)

const shootThese = curry(shootTargets)(targets)
const repeatShoot = (n) => range(0, n)
  .reduce(shootThese, people)

console.log(range(0, 10).map(repeatShoot))
