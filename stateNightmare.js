const Nightmare = require('nightmare');
const nightmareStateData = Nightmare({ show: true });
const fs = require('fs');

nightmareStateData
  .goto('https://www.nps.gov')
  .click('button.SearchBar-keywordSearch')
  .wait(5000)
  .evaluate(() => {
    let states = [...document.querySelectorAll('ul.dropdown-menu li a')].map( element => {
      return { 
        name: `${element.innerText}`
      }
    })
    return states
  })
  .end()
  .then(results => {
    let states = JSON.stringify({ states: results }, null, ' ')
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


