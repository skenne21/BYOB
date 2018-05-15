const Nightmare = require('nightmare');
const nightmareStateData = Nightmare({ show: true });
const fs = require('fs');

nightmareStateData
  .goto('https://simple.wikipedia.org/wiki/List_of_U.S._states')
  .wait(5000)
  .evaluate(() => {
    let states = [...document.querySelectorAll('table.wikitable tbody tr')].map( element => {
      const results = element.innerText.split('\t');

      return {
        capital: results[3],
        name: results[2],
        stateHood: results[4],
        abbr: results[1]
      }
    })
    return states
  })
  .end()
  .then(results => {
    console.log(results)
    let states = JSON.stringify(results, null, ' ')
    fs.writeFile('./states-data.json', states, 'utf8', err => {
      if (err) {
        console.log('fs', err)
        throw new Error('nope')
      }
  })
    // .catch( err => console.log('catch fs', err))
  })
  .catch(err => console.log('errorTaco',err))


// nightmareStateData
//   .goto('https://en.wikipedia.org/wiki/List_of_states_and_territories_of_the_United_States')
//   .evaluate(() => {
//     let states = [...document.querySelectorAll('table.wikitable')]
//   })
