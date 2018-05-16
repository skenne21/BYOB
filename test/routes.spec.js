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
})
