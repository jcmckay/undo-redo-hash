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

module.exports = Hash;