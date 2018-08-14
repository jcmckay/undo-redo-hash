function Hash() {

  this.hash = {};
  this.changes = [];
  this.changeIndex = this.changes.length-1;

  this.get = function(key) {
    return this.hash[key];
  }

  this.set = function(key, value) {

    while(this.changes.length-1 > this.changeIndex){
      this.changes.pop();
    }

    if(!this.hash[key]) {
      this.changes.push({ type: 'add', key: key, value: value });
    } else {
      this.changes.push({ type: 'update', key: key, value: this.hash[key] });
    }

    this.changeIndex++;

    this.hash[key] = value;
    return this.hash;
  }

  this.delete = function(key) {
    while(this.changes.length-1 > this.changeIndex){
      this.changes.pop();
    }

    this.changes.push({ type: 'delete', key: key, value: this.hash[key]});
    this.changeIndex++;
    delete this.hash[key];
    return this.hash;
  }

  this.undo = function() {

    if(this.changeIndex < 0)
      throw Error('Nothing to undo');

    const lastChange = this.changes[this.changeIndex];

    switch(lastChange.type) {
      case 'add':
        delete this.hash[lastChange.key];
        break;
      case 'update':
        const tempVal = lastChange.value;
        this.changes[this.changeIndex].value = this.hash[lastChange.key];
        this.hash[lastChange.key] = tempVal;
        break;
      case 'delete':
        this.hash[lastChange.key] = lastChange.value;
        break
      default:
        break;

    }

    this.changeIndex--;
    return this.hash;

  }

  this.redo = function() {
    if(this.changeIndex === this.changes.length -1)
      throw Error('Nothing to Redo');

    const lastChange = this.changes[this.changeIndex+1];

    switch(lastChange.type) {
      case 'add':
      case 'update':
        this.hash[lastChange.key] = lastChange.value;
        break;
      case 'update':
        const tempVal = lastChange.value;
        this.changes[this.changeIndex].value = this.hash[lastChange.key];
        this.hash[lastChange.key] = tempVal;
        break;
      case 'delete':
        delete this.hash[lastChange.key];
        break
      default:
        break;

    }

    this.changeIndex++;
    return this.hash;

  }

};

var expect = require("chai").expect;

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

  });
});