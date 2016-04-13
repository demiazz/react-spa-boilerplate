import chai from 'chai';
import { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chaiEnzyme from 'chai-enzyme';
import chaiAsPromised from 'chai-as-promised';
import jsdom from 'mocha-jsdom';

// Use chai extensions

chai.use(sinonChai);
chai.use(chaiEnzyme());
chai.use(chaiAsPromised);

// Make chai and sinon globally visible

global.expect = expect;
global.sinon = sinon;

// Enable DOM emulation

jsdom();

// Mockup non JS resources

function noop() { }

require.extensions['.css'] = noop;
