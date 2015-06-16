var Promise = require('bluebird');

require('should');

function foo() {
  return new Promise(function(resolve, reject) {
    reject("Awooga!");
  });
}

function bar() {
  return new Promise(function(resolve, reject) {
    resolve("Bar");
  });
}

describe('Promise chaining', function() {
  it('should chain', function() {
    return foo()
      .then(function(r1) {
        return bar();
      })
      .then(function(r2) {
        r2.should.eql("Bar");
      })
      .catch(function(err) {
        console.log(err);
        err.should.eql("Awooga!")
      });
  });
});
