const Nightmare = require('nightmare');
const nightmareParksData = Nightmare({ show: true });
const fs = require('fs');

nightmareParksData
  .goto('https://en.wikipedia.org/wiki/List_of_national_parks_of_the_United_States')
  .wait(5000)
  .evaluate( () => {
    let stateNames = [...document.querySelectorAll('table.wikitable tbody tr ')].map(element => {
      const results = element.innerText.split('\t')
      const cleanResults = results.filter( res => res !== '')
      const cleanLocation  = cleanResults[1].split('\n')
      const cleanSummary = cleanResults[5].replace(/[\[\]']+/g, '')
      const removeNumbersSummary = cleanSummary.replace(/[0-9]/g, '')

      console.log(cleanResults[5])
      return {
        name: cleanResults[0],
        location: cleanLocation[0],
        latLong: cleanLocation[1],
        date_open: cleanResults[2],
        summary: removeNumbersSummary
      }
    })

    return [...stateNames];
  })
  .end()
  .then( results => {
    let parks = JSON.stringify({parks: results}, null, " ")

    fs.writeFile('./scraping-data/parks-data.json', parks, "utf8", err => {
      if ( err) {
        throw new Error('nope')
      }
    })
  })
  .catch( err => {
    console.log(err)
  })
