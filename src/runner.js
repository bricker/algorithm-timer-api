const DataSet$ArrayInteger = require('./dataset/ArrayInteger.js');

const supportedLanguages = [
  'javascript',
];

const dataTypesMap = {
  'Array<Integer>': DataSet$ArrayInteger,
};

const maxDataSize = 10 ** 100;

const runner = (req, res) => {
  const {
    code,
    language,
    dataSize = 10 ** 5,
    dataType,
    dataOptions = {},
  } = req.body;

  if (!supportedLanguages.some(e => language === e)) {
    return res.status(400).send('Language not supported. See the README for supported languages.');
  }

  if (!Object.keys(dataTypesMap).some(e => e === dataType)) {
    return res.status(400).send('Input Type not supported. See the README for supported input types.');
  }

  if (dataSize > maxDataSize) {
    return res.status(400).send('Data size too large. Max size is 10^100.');
  }

  // TODO: Obviously, this is unsafe and needs to be sanitized.
  // eslint-disable-next-line no-eval
  const algorithm = eval(`(function () { return ${code}; })`);

  if (typeof algorithm !== 'function') {
    return res.status(400).send('A function must be passed to this endpoint.');
  }

  const DataGeneratorClass = dataTypesMap[dataType];
  let dataGenerator;
  let timeStart;
  let timeEnd;

  dataGenerator = new DataGeneratorClass({ dataSize, dataOptions });
  timeStart = new Date();
  algorithm()(dataGenerator.get());
  timeEnd = new Date();
  const timeBaseline = timeEnd - timeStart;

  // Find the approximate time complexity
  dataGenerator = new DataGeneratorClass({ dataSize: dataSize * 2, dataOptions });
  timeStart = new Date();
  algorithm()(dataGenerator.get());
  timeEnd = new Date();
  const time2x = timeEnd - timeStart;

  dataGenerator = new DataGeneratorClass({ dataSize: dataSize * 10, dataOptions });
  timeStart = new Date();
  algorithm()(dataGenerator.get());
  timeEnd = new Date();
  const time10x = timeEnd - timeStart;

  let timeComplexity = 'unknown';

  if (
    (Math.floor(time2x / 1000) === Math.floor((timeBaseline * 2) / 1000))
    && (Math.floor(time10x / 1000) === Math.floor(timeBaseline * 10) / 1000)
  ) {
    timeComplexity = 'O(n)';
  } else if (
    (Math.floor(time2x / 1000) > Math.floor((timeBaseline * 2) / 1000))
    && (Math.floor(time10x / 1000) > Math.floor(timeBaseline * 10) / 1000)
  ) {
    timeComplexity = 'O(n^2)';
  } else if (
    (Math.floor(time10x / 1000) < Math.floor(timeBaseline * 10) / 1000)
  ) {
    timeComplexity = 'O(log(n))';
  }

  const responseData = {
    runtimeMs: timeBaseline,
    runtimeMs2x: time2x,
    runtimeMs10x: time10x,
    timeComplexity,
  };

  return res.status(200).send(responseData);
};

module.exports = runner;
