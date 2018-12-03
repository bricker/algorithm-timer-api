class DataSet$ArrayInteger {
  constructor({ dataSize, dataOptions }) {
    this.dataSize = dataSize;
    this.range = dataOptions.range || Math.floor(dataSize / 10);
  }

  get() {
    // TODO: Is there a more efficient way to do this?
    const data = new Array(this.dataSize);

    for (let i = 0; i < this.dataSize; i += 1) {
      data.push(Math.random());
    }

    return data;
  }
}

module.exports = DataSet$ArrayInteger;
