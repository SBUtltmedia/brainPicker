// mocha --compilers js:babel-core/register --watch test/reducers/test_currentQuestion.js

import { expect } from 'chai';
import * as currentQuestion from '../../reducers/currentQuestion';

describe('currentQuestion', () => {
  it('adds marker to layer 1', () => {
    const layer = 1;
    const markers = [];
    const marker = { position: [200, 300], layer: layer };
    const result = currentQuestion.addMarkerToLayer(layer, markers, marker)
    expect([[{ position: [200, 300], layer: layer }]]).to.deep.equal(result);
  });

  it('adds marker to layer 2', () => {
    const layer = 2;
    const markers = [];
    const marker = { position: [200, 300], layer: layer };
    const result = currentQuestion.addMarkerToLayer(layer, markers, marker)
    expect([undefined, [{ position: [200, 300], layer: layer }]]).to.deep.equal(result);
  });

  it('adds several markers to layer 2', () => {
    const layer = 2;
    const markers = [];
    const marker1 = { a: 1 };
    const marker2 = { b: 2 };
    const result1 = currentQuestion.addMarkerToLayer(layer, markers, marker1)
    const result2 = currentQuestion.addMarkerToLayer(layer, result1, marker2)
    expect([undefined, [{ a: 1 }, { b: 2 }]]).to.deep.equal(result2);
  });
});
