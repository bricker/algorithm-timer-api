
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/index.js');

const expect = chai.expect;
chai.use(chaiHttp);

describe('Runner', function() {
  describe('Unsupported Language', function() {
    it ('returns a 400 error', async function() {
      const resp = await chai.request(app)
        .post('/run')
        .set('Content-Type', 'application/json')
        .send({ language: 'brainfuck', code: '+[-->-[>>+>-----<<]<--<---]>-.>>>+.>>..+++[.>]<<<<.+++.------.<<-.>>>>+.' });

      expect(resp).to.have.status(400);
    });
  })
});
