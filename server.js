const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.set('port', process.env.PORT || 3000);

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({extended: true}));

app.locals.title = 'parkFinder';

app.get('/', (request, response) => {

});

app.get('/api/v1/states', (request, response) => {
  database('states').select()
    .then(states => {
      response.status(200).json(states)
    })
    .catch(error => {
      response.status(500).json({ error })
    })
});

app.get('/api/v1/states/:id', (request, response) => {
  database('states').where('id', request.params.id).select()
    .then(state => {
      if (state.length) {
        response.status(200).json(state);
      } else {
        response.status(404).json({
          error: `Could not find state with id ${request.params.id}`
        })
      }
    })
    .catch(error => {
      request.status(500).json({error})
    })
});

app.get('/api/v1/parks', (request, response) => {
  database('parks').select()
    .then(parks => {
      response.status(200).json(parks)
    })
    .catch(error => {
      response.status(500).json({error})
    })
});

app.get('/api/v1/parks/:id', (request, response) => {
  database('parks').where('id', request.params.id).select()
    .then(park => {
      if (park.length) {
        response.status(200).json(park)
      } else {
        response.status(404).json({
          error: `Could not find park with id ${request.params.id}`
        })
      }
    })
    .catch(error => {
      request.status(500).json({error})
    })
});

app.get('/api/v1/states/:id/parks', (request, response) => {
  database('parks').where('state_id', request.params.id).select()
    .then(parks => {
      console.log(parks)
      if (parks.length) {
        response.status(200).json(parks)
      } else {
        response.status(404).json({
          error: `Could not find parks with id ${request.params.id}`
        })
      }
    })
    .catch(error => {
      request.status(500).json({error})
    })
});

// app.post('/api/v1/projects/:id/palettes', (request, response) => {
//   const palette = request.body;
//   debugger
//   database('palettes').insert({...palette, project_id: request.params.id}, 'id')
//     .then(palette => {
//       response.status(201).json({ id: palette[0] })
//     })
//     .catch(error => {
//       response.status(500).json({ error })
//     })
// });

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on port ${app.get('port')}`)
})
