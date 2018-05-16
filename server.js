const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.set('port', process.env.PORT || 3000);

app.use(bodyParser.json());

app.use(express.static('public'));

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

app.post('/api/v1/states', (request, response) => {
  const state = request.body;

  for (let requiredParameter of ['name', 'abbv', 'capital', 'stateHood']) {
    if (!state[requiredParameter]) {
      return response
        .status(422)
        .send({
            error: `Expected format: { name: <String>, abbv: <String>, stateHood: <String>, capital: <String> }. You're missing a "${requiredParameter}" property.`
        });
    }
  }

  database('states').insert(state, 'id')
    .then( state => {
      response.status(201).json({ id: state[0] })
    })
    .catch( error => {
      response.status(500).json({error})
    })
});

app.post('/api/v1/parks', (request, response) => {
  const park = request.body;

  for (let requiredParameter of ['name', 'location', 'date_open', 'latLong', 'summary', 'state_id']) {
    if (!park[requiredParameter]) {
      return response
        .status(422)
        .send({
            error: `Expected format: { name: <String>, location: <String>, date_open: <String>, latLong: <String>, summary: <String>, state_id: <String> }. You're missing a "${requiredParameter}" property.`
        });
    }
  }

  database('parks').insert(park, 'id')
    .then( park => {
      response.status(201).json({id: park[0]})
    })
    .catch( error => {
      response.status(500).json({error})
    })

})

app.delete('/api/v1/states/:id', (request, response) => {
  database('states').where('id', request.params.id).del()
    .then( id => {
      if (id) {
        response.status(204).json({ id })
      } else {
        response.status(404).json({
          error: `Could not find state with id ${request.params.id}`
        })
      }
    })
    .catch( error => {
      response.status(500).json({error})
    })
})

app.delete('/api/v1/parks/:id', (request, response) => {
  database('parks').where('id', request.params.id).del()
    .then( id => {
      if (id) {
        response.status(204).json({ id })
      } else {
        response.status(404).json({
          error: `Could not find state with id ${request.params.id}`
        })
      }
    })
    .catch( error => {
      response.status(500).json({error})
    })
})

app.put('/api/v1/states/:id', (request, response) => {
  const state = request.body;

  for (let requiredParameter of ['name', 'abbv', 'capital', 'stateHood']) {
    if (!state[requiredParameter]) {
      return response
        .status(422)
        .send({
            error: `Expected format: { name: <String>, abbv: <String>, stateHood: <String>, capital: <String> }. You're missing a "${requiredParameter}" property.`
        });
    }
  }

  database('states').where('id', request.params.id).update(state, 'id')
    .then( id => {
      if (id.length) {
        response.status(201).json({ id: id[0] })
      } else {
        response.status(404).json({
          error: `the state with the id ${request.params.id} was not found`
        })
      }
    })
    .catch( error => {
      response.status(500).json({ error })
    })
})

app.put('/api/v1/parks/:id', (request, response) => {
  const park = request.body;

  for (let requiredParameter of ['name', 'date_open', 'latLong', 'location', 'summary']) {
    if (!park[requiredParameter]) {
      return response
        .status(422)
        .send({
            error: `Expected format: { name: <String>, date_open: <String>, latLong: <String>, location: <String>, summary: <String> }. You're missing a "${requiredParameter}" property.`
        });
    }
  }

  database('parks').where('id', request.params.id).update(park, 'id')
    .then( id => {
      if (id.length) {
        response.status(201).json({ id: id[0] })
      } else {
        response.status(404).json({
          error: `the state with the id ${request.params.id} was not found`
        })
      }
    })
    .catch( error => {
      response.status(500).json({ error })
    })
})

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on port ${app.get('port')}`)
})

module.exports = app;
