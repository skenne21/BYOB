const Nightmare = require('nightmare');
const nightmare = Nightmare({ show: true });
const fs = require('fs');

nightmare
  .goto('https://www.nps.gov')
  .click('button.SearchBar-keywordSearch')
  .wait(5000)
  .evaluate(() => {
    // let anchor = document.querySelector('a#anch_6').innerText
    // console.log(anchor)
    // return anchor
    let states = [...document.querySelectorAll('ul.dropdown-menu li a')].map( element => {
      console.log(element)
      return { name: `${element.innerText}`,
               id: element.id
             }
    })
    return states
  })
  .end()
  .then(results => {
    console.log('res',results)
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
