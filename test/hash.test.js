const Hash = require('../app/hash.js'),
      expect = require("chai").expect;

describe('Hash', function() {
  describe('#get', function() {
    it('should return a value if present', function() {
      hash = new Hash();
      hash.set(2,1);
      expect(hash.get(2)).to.equal(1);
    });

    it('should NOT return a value if present', function() {
      hash = new Hash();
      expect(hash.get(4)).to.equal(undefined);
    });
  });


  describe('#delete', function() {
    it('should delete a key if present', function() {
      hash = new Hash();
      hash.set(2,1);
      expect(hash.get(2)).to.equal(1);
      hash.delete(2)
      expect(hash.get(2)).to.equal(undefined);
    });

  });


  describe('#undo', function() {
    it('should throw an error if there is nothing to undo', function() {
      hash = new Hash();
      expect(hash.undo.bind(hash)).to.throw('Nothing to undo');
    });

  });

  describe('#redo', function() {
    it('should throw an error if there is nothing to redo', function() {
      hash = new Hash();
      expect(hash.redo.bind(hash)).to.throw('Nothing to Redo');
    });

    it('should redo after an undo', function() {
      hash = new Hash();
      hash.set(4,7);
      expect(hash.get(4)).to.equal(7);
      hash.undo();
      expect(hash.get(4)).to.equal(undefined);
      hash.redo();
      expect(hash.get(4)).to.equal(7);
    });

    it('should redo multiples after a undoing multples', function() {
      hash = new Hash();
      hash.set(4,1);
      hash.set(4,2);
      hash.set(4,3);
      hash.set(4,4);

      expect(hash.get(4)).to.equal(4);
      hash.undo();
      expect(hash.get(4)).to.equal(3);
      hash.undo();
      expect(hash.get(4)).to.equal(2);
      hash.undo();
      expect(hash.get(4)).to.equal(1);
      hash.undo();
      expect(hash.get(4)).to.equal(undefined);
      hash.redo();
      expect(hash.get(4)).to.equal(1);
      hash.redo();
      expect(hash.get(4)).to.equal(2);
      hash.redo();
      expect(hash.get(4)).to.equal(3);
      hash.redo();
      expect(hash.get(4)).to.equal(4);
    });

    it('should undo and redo deletes', function() {
      hash = new Hash();
      hash.set(4,1);
      expect(hash.get(4)).to.equal(1);
      hash.delete(4);
      expect(hash.get(4)).to.equal(undefined);
      hash.undo();
      expect(hash.get(4)).to.equal(1);
    });

  });
});