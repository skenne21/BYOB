const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server.js');

const environment = process.env.NODE_ENV || 'test';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

chai.use(chaiHttp);

describe('client-routes', () => {
  it('should return homepage with an html document', () => {
    return chai.request(server)
      .get('/')
      .then( response => {
        response.should.have.status(200);
        response.should.be.html
      })
      .catch(error => {
        throw error;
      })
  })
  it('should return 404 if the request is not found', () => {
    return chai.request(server)
      .get('/fjdljdlj')
      .then( response => {
        response.should.have.status(404);
      })
      .catch(error => {
        throw error;
      })
  })
});

describe('API-routes', () => {
  beforeEach((done) => {
    database.migrate.rollback()
      .then(() => {
        database.migrate.latest()
        .then(() => {
          return database.seed.run()
            .then(() => {
              done()
            })
        })
      })
    });

    describe('GET /api/v1/states', () => {
      it('should get all the states', () => {
        return chai.request(server)
          .get('/api/v1/states')
          .then( response => {
            response.should.be.json;
            response.should.have.status(200);
            response.body.should.be.an('array');
            response.body[0].should.have.property('id');
            response.body[0].id.should.equal(1);
            response.body[0].should.have.property('name');
            response.body[0].name.should.equal('Alabama');
            response.body[0].should.have.property('abbv');
            response.body[0].abbv.should.equal('AL');
            response.body[0].should.have.property('capital');
            response.body[0].capital.should.equal('Montgomery');
            response.body[0].should.have.property('stateHood');
            response.body[0].stateHood.should.equal('December 14, 1819');
          })
          .catch(error => {
            throw error;
          })
      })
    });

    describe('GET /api/v1/parks', () => {
      it('gets all the parks', () => {
        return chai.request(server)
          .get('/api/v1/parks')
          .then( response => {
            response.should.be.json;
            response.should.have.status(200);
            response.body.should.be.an('array');
            response.body[0].should.have.property('id');
            response.body[0].id.should.equal(1);
            response.body[0].should.have.property('name');
            response.body[0].name.should.equal('Acadia');
            response.body[0].should.have.property('date_open');
            response.body[0].date_open.should.equal('February 26, 1919');
            response.body[0].should.have.property('latLong');
            response.body[0].latLong.should.equal('44.35°N 68.21°W');
            response.body[0].should.have.property('location');
            response.body[0].location.should.equal('Maine');
            response.body[0].should.have.property('summary');
            response.body[0].summary.should.equal(`Covering most of Mount Desert Island and other coastal islands, Acadia features the tallest mountain on the Atlantic coast of the United States, granite peaks, ocean shoreline, woodlands, and lakes. There are freshwater, estuary, forest, and intertidal habitats.`);
            response.body[0].should.have.property('state_id');
            response.body[0].state_id.should.equal(19);
          })
          .catch(error => {
            throw error;
          })
      })
    })

    describe('GET /api/v1/states/:id', () => {
      it('gets a state by id', () => {
        return chai.request(server)
          .get('/api/v1/states/1')
          .then( response => {
            response.should.have.status(200);
            response.should.be.json;
            response.body.should.be.an('array');
            response.body[0].should.have.property('id');
            response.body[0].id.should.equal(1);
            response.body[0].should.have.property('name');
            response.body[0].name.should.equal('Alabama');
            response.body[0].should.have.property('abbv');
            response.body[0].abbv.should.equal('AL');
            response.body[0].should.have.property('capital');
            response.body[0].capital.should.equal('Montgomery');
            response.body[0].should.have.property('stateHood');
            response.body[0].stateHood.should.equal('December 14, 1819');
          })
          .catch( error => {
            throw error;
          })
      })
      it('should send a status of 404 if id does not exist', () => {
        return chai.request(server)
          .get('/api/v1/states/1220')
          .then( response => {
            response.should.have.status(404);
            response.should.be.a('object');
            response.body.error.should.equal('Could not find state with id 1220')
          })
          .catch(error => {
            throw error;
          })
      })
    })

    describe('GET /api/v1/parks/:id', () => {
      it('should return a park by id', () => {
        return chai.request(server)
          .get('/api/v1/parks/1')
          .then( response => {
            response.should.have.status(200);
            response.should.be.json;
            response.body.should.be.an('array');
            response.body[0].should.have.property('id');
            response.body[0].id.should.equal(1);
            response.body[0].should.have.property('name');
            response.body[0].name.should.equal('Acadia');
            response.body[0].should.have.property('date_open');
            response.body[0].date_open.should.equal('February 26, 1919');
            response.body[0].should.have.property('latLong');
            response.body[0].latLong.should.equal('44.35°N 68.21°W');
            response.body[0].should.have.property('location');
            response.body[0].location.should.equal('Maine');
            response.body[0].should.have.property('summary');
            response.body[0].summary.should.equal(`Covering most of Mount Desert Island and other coastal islands, Acadia features the tallest mountain on the Atlantic coast of the United States, granite peaks, ocean shoreline, woodlands, and lakes. There are freshwater, estuary, forest, and intertidal habitats.`);
            response.body[0].should.have.property('state_id');
            response.body[0].state_id.should.equal(19);
          })
          .catch(error => {
            throw error;
          })
      })
      it('should send a status of 404 if id does not exist', () => {
        return chai.request(server)
          .get('/api/v1/parks/1220')
          .then( response => {
            response.should.have.status(404);
            response.should.be.a('object');
            response.body.error.should.equal('Could not find park with id 1220')
          })
          .catch(error => {
            throw error;
          })
      })
    })

    describe('GET /api/v1/states/:id/parks', () => {
      it('should return an array of all parks with a specific state id', () => {
        return chai.request(server)
          .get('/api/v1/states/19/parks')
          .then( response => {
            response.should.have.status(200);
            response.should.be.json;
            response.body.should.be.an('array');
            response.body[0].should.have.property('id');
            response.body[0].id.should.equal(1);
            response.body[0].should.have.property('name');
            response.body[0].name.should.equal('Acadia');
            response.body[0].should.have.property('date_open');
            response.body[0].date_open.should.equal('February 26, 1919');
            response.body[0].should.have.property('latLong');
            response.body[0].latLong.should.equal('44.35°N 68.21°W');
            response.body[0].should.have.property('location');
            response.body[0].location.should.equal('Maine');
            response.body[0].should.have.property('summary');
            response.body[0].summary.should.equal(`Covering most of Mount Desert Island and other coastal islands, Acadia features the tallest mountain on the Atlantic coast of the United States, granite peaks, ocean shoreline, woodlands, and lakes. There are freshwater, estuary, forest, and intertidal habitats.`);
            response.body[0].should.have.property('state_id');
            response.body[0].state_id.should.equal(19);
          })
          .catch(error => {
            throw error;
          })
      })
      it('should send a status of 404 if id does not exist', () => {
        return chai.request(server)
          .get('/api/v1/states/1220/parks/')
          .then( response => {
            response.should.have.status(404);
            response.should.be.a('object');
            response.body.error.should.equal('Could not find parks with id 1220')
          })
          .catch(error => {
            throw error;
          })
      })
    })

    describe('POST /api/v1/states', () => {
      it('should post a new new state to the database', () => {
        return chai.request(server)
          .post('/api/v1/states')
          .send({
            name: 'bananas',
            abbv: 'BA',
            capital: 'Monkeys',
            stateHood: 'yesterday'
          })
          .then(response => {
            response.should.have.status(201);
            response.body.should.be.a('object');
            response.body.should.have.property('id');
            response.body.id.should.equal(51);
          })
          .catch(error => {
            throw error;
          })
      })
    it('should send 422 if missing req params', () => {
      return chai.request(server)
        .post('/api/v1/states')
        .send({
          name: 'bananas',
          abbv: 'BA',
          capital: 'Monkeys',
        })
        .then( response => {
          response.should.have.status(422);
          response.body.should.be.a('object');
          response.body.error.should.equal('Expected format: { name: <String>, abbv: <String>, stateHood: <String>, capital: <String> }. You\'re missing a "stateHood" property.')
        })
        .catch(error => {
          throw error;
        })
    })
  })

  describe('POST /api/v1/parks', () => {
    it('should post a new park to the database', () => {
      return chai.request(server)
        .post('/api/v1/parks')
        .send({
          name: 'tacotown',
          location: 'BA',
          date_open: 'Monkeys',
          latLong: 'yesterday',
          summary: 'yup',
          state_id: 2
        })
        .then(response => {
          response.should.have.status(201);
          response.body.should.be.a('object');
          response.body.should.have.property('id');
          response.body.id.should.equal(59);
        })
        .catch(error => {
          throw error;
        })
    })

  it('should send 422 if missing req params', () => {
    return chai.request(server)
      .post('/api/v1/parks')
      .send({
        name: 'tacotown',
        location: 'BA',
        date_open: 'Monkeys',
        latLong: 'yesterday',
        summary: 'yup'
      })
      .then( response => {
        response.should.have.status(422);
        response.body.should.be.a('object');
        response.body.error.should.equal('Expected format: { name: <String>, location: <String>, date_open: <String>, latLong: <String>, summary: <String>, state_id: <String> }. You\'re missing a "state_id" property.')
      })
      .catch(error => {
        throw error;
      })
    })
  })

  describe('DELETE /api/v1/states/:id', () => {
    it('should delete a record with a spec id', () => {
      return chai.request(server)
        .delete('/api/v1/states/1')
        .then(response => {
          response.should.have.status(204);
        })
        .catch(error => {
          throw error;
        })
    })

    it('should send a status of 404 if the id does not match', () => {
      return chai.request(server)
        .delete('/api/v1/states/2022')
        .then(response => {
          response.should.have.status(404)
        })
        .catch(error => {
          throw error
        })
    })
  })

  describe('DELETE /api/v1/parks/:id', () => {
    it('should delete a record with a spec id', () => {
      return chai.request(server)
        .delete('/api/v1/parks/1')
        .then(response => {
          response.should.have.status(204);
        })
        .catch(error => {
          throw error;
        })
    })

    it('should send a status of 404 if the id does not match', () => {
      return chai.request(server)
        .delete('/api/v1/parks/2022')
        .then(response => {
          response.should.have.status(404)
        })
        .catch(error => {
          throw error
        })
    })
  })
})
