const { compose, prop, map, match, join, set, concat, lensIndex, flatten } = require('ramda')
const { Just, Nothing } = require('folktale/maybe')
const Task = require('folktale/concurrency/task')
const fetch = require('node-fetch')

// truthy :: a -> Maybe a
const truthy = (a) => a ? Just(a) : Nothing()

// getMembers :: (Organisation, Number) -> Task Response [a]
const getMembers = Task.fromPromised((org, page=1) => 
  fetch(`https://api.github.com/orgs/${org}/members?page=${page}` + 
        `&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}`))
// getRepos :: (User, Number) -> Task Response [a]
const getRepos = Task.fromPromised((user, page=1) => 
  fetch(`https://api.github.com/users/${user}/repos?page=${page}` + 
        `&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}`))
// getLinkHeader :: Response -> Maybe String
const getLinkHeader = (response) => truthy(response.headers.get('Link'))
// getNextPage :: String -> Number
const getNextPage = compose(Number, prop(1), match(/page=([0-9]+)/))
// setPage :: (a, Number) -> (a, Number)
const setPage = set(lensIndex(1))

// getAllPages :: ((a, Number) -> Task Response [b]) -> (a, Number) -> [b]
const getAllPages = (fetcher, params, state=[]) => {
  return Task.do(function *() {
    const response = yield fetcher(...params)
    const newState = yield Task.fromPromised(() => response.json())().map(concat(state))
    return getLinkHeader(response).map(getNextPage)
      .chain((next) => (next > 1) ? Just(getAllPages(fetcher, setPage(next, params), newState))
                       /* else */ : Nothing())
      .getOrElse(Task.of(newState))
  })
} // Task.do is syntactic sugar: https://gist.github.com/framp/0f78330387edcb47a69130a2e11da914

// resultTemplate :: Repo -> String
const resultTemplate = ({ name, description,
                          html_url: link, 
                          owner: { login: author }, 
                          stargazers_count: stars }) =>
  `Name: [${name}](${link})\n` +
  `Author: ${author}\n` + 
  (description ? 'Description: ' + description + '\n' : '') +
  `Stars: ${stars}\n`

// main :: Organisation -> Task ()
const main = (org) => getAllPages(getMembers, [org, 1])
  .map(map(prop('login')))
  .chain(compose(Task.waitAll, map(member => getAllPages(getRepos, [member, 1]))))
  .map(compose(join('\n'), map(resultTemplate), flatten))
  .map(console.log)

main('tes').run()