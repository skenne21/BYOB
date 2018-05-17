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
  let token, adminToken;

  beforeEach((done) => {
    token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InN0ZXZlbiIsImFwcE5hbWUiOiJzYWJyaW5hIiwiaWF0IjoxNTI2NTEzNzg4LCJleHAiOjE1MjY2ODY1ODh9.eakb1OdlvvvIkfL4nGJ8OfvAgmhUl1tlwBAn98a0jak';
    adminToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InR1cmluZ0B0dXJpbmcuaW8iLCJhcHBOYW1lIjoiYmF0cyIsImFkbWluIjoidHVyaW5nQHR1cmluZy5pbyIsImlhdCI6MTUyNjU5Mjg0NSwiZXhwIjoxNTI2NzY1NjQ1fQ.js2N3AgO49xEMgbGMkMK4Ys4D9Js-8jSy6mpfk7UNDo'
    database.migrate.rollback()
      .then(() => {
        return database.migrate.latest()
      })
      .then(() => {
        return database.seed.run()
      })
      .then(() => {
        done()
      })
  });

  describe('GET /api/v1/states', () => {
    it('should get all the states', () => {
      return chai.request(server)
        .get(`/api/v1/states?token=${token}`)
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

    it('should get a state with an abbv', () => {
      return chai.request(server)
        .get(`/api/v1/states?token=${token}&abbv=CO`)
        .then( response => {
          response.should.be.json;
          response.should.have.status(200);
          response.body.should.be.a('object');
          response.body.should.have.property('id');
          response.body.id.should.equal(6);
          response.body.should.have.property('name');
          response.body.name.should.equal('Colorado');
          response.body.should.have.property('abbv');
          response.body.abbv.should.equal('CO');
          response.body.should.have.property('capital');
          response.body.capital.should.equal('Denver');
          response.body.should.have.property('stateHood');
          response.body.stateHood.should.equal('August 1, 1876')
        })
        .catch( error => {
          throw error
        })
    })

    it('should send a 422 status if the state Abbv does not exist', () => {
      return chai.request(server)
        .get(`/api/v1/states?token=${token}&abbv=C`)
        .then( response => {
          response.should.be.json;
          response.should.have.status(422);
          response.body.should.be.a('object');
          response.body.error.should.equal('States not Found with abbv of C')
        })
        .catch( error => {
          throw error
        })
    })
  });

  describe('GET /api/v1/parks', () => {
    it('gets all the parks', () => {
      return chai.request(server)
        .get(`/api/v1/parks?token=${token}`)
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
        .get(`/api/v1/states/1?token=${token}`)
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
        .get(`/api/v1/states/1220?token=${token}`)
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
        .get(`/api/v1/parks/1?token=${token}`)
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
        .get(`/api/v1/parks/1220?token=${token}`)
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
        .get(`/api/v1/states/19/parks?token=${token}`)
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
        .get(`/api/v1/states/1220/parks/?token=${token}`)
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
        .post(`/api/v1/states?token=${adminToken}`)
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
        .post(`/api/v1/states?token=${adminToken}`)
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
        .post(`/api/v1/parks?token=${adminToken}`)
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
        .post(`/api/v1/parks?token=${adminToken}`)
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
        .delete(`/api/v1/states/1?token=${adminToken}`)
        .then(response => {
          response.should.have.status(204);
        })
        .catch(error => {
          throw error;
        })
    })

    it('should send a status of 404 if the id does not match', () => {
      return chai.request(server)
        .delete(`/api/v1/states/2022?token=${adminToken}`)
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
        .delete(`/api/v1/parks/1?token=${adminToken}`)
        .then(response => {
          response.should.have.status(204);
        })
        .catch(error => {
          throw error;
        })
    })

    it('should send a status of 404 if the id does not match', () => {
      return chai.request(server)
        .delete(`/api/v1/parks/2022?token=${adminToken}`)
        .then(response => {
          response.should.have.status(404)
        })
        .catch(error => {
          throw error
        })
    })
  })

  describe('PUT /api/v1/states/:id', () => {
    it('should modify a single state by id', () => {
      return chai.request(server)
        .put(`/api/v1/states/1?token=${adminToken}`)
        .send({
          name: 'frankiebeans',
          abbv: 'PA',
          capital: 'Oranguatangs',
          stateHood: 'tomorrow'
        })
        .then(response => {
          response.should.have.status(201);
          response.body.should.be.a('object');
          response.body.should.have.property('id');
          response.body.id.should.equal(1)
        })
        .catch(error => {
          throw error
        })
    })

    it('should send 422 if missing req params', () => {
      return chai.request(server)
        .put(`/api/v1/states/1?token=${adminToken}`)
        .send({
          name: 'frankiebeans',
          abbv: 'PA',
          capital: 'Oranguatangs',
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

  describe('PUT /api/v1/parks/:id', () => {
    it('should replace a single park by id', () => {
      return chai.request(server)
        .put(`/api/v1/parks/1?token=${adminToken}`)
        .send({
          name: 'tacotown',
          location: 'BA',
          date_open: 'Monkeys',
          latLong: 'yesterday',
          summary: 'yup'
        })
        .then( response => {
          response.should.have.status(201);
          response.body.should.be.a('object');
          response.body.should.have.property('id');
          response.body.id.should.equal(1)
        })
        .catch(error => {
          throw error;
        })
    })

    it('should send 422 if missing req params', () => {
      return chai.request(server)
        .put(`/api/v1/parks/1?token=${adminToken}`)
        .send({
          name: 'tacotown',
          location: 'BA',
          date_open: 'Monkeys',
          latLong: 'yesterday',
        })
        .then( response => {
          response.should.have.status(422);
          response.body.should.be.a('object');
          response.body.error.should.equal(`Expected format: { name: <String>, date_open: <String>, latLong: <String>, location: <String>, summary: <String> }. You\'re missing a "summary" property.`)
        })
        .catch(error => {
          throw error;
        })
    })
  })
})
