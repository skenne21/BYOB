const statesData = require('../../../scraping-data/states-data.js');
const parksData = require('../../../scraping-data/parks-data.js');

exports.seed = function(knex, Promise) {
  return knex('parks').del()
    .then(() => {
      return knex('states').del()
    })
    .then(() => {
      return knex('states').insert(statesData.states)
    })
    .then(() => {
      let parksPromises = [];
      parksData.parks.forEach( park => {
        let state = park.location;
        parksPromises.push(createParks(knex, park, state))
      })
      return Promise.all(parksPromises)
    })
}

const createParks = (knex, park, state) => {
  return knex('states').where('name', state).first()
    .then((stateRecord) => {
      return knex('parks').insert({
        name: park.name,
        date_open: park.date_open,
        latLong: park.latLong,
        location: park.location,
        summary: park.summary,
        state_id: stateRecord.id
      })
    })
}
