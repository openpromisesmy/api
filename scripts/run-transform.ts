import batchTransform from './lib/batch-transform';
import helpers from './lib/helpers';
import config from './config';
import path from 'path';
import utils from './lib/utils';

function runTransform() {
  const inputPath = path.resolve(`./data/${config.TRANSFORM.INPUT_FILE}`);
  const docs = helpers.readJsonFile(inputPath);
  const transformedDocs = batchTransform(docs);
  const outputPath = path.resolve(`./data/${config.TRANSFORM.OUTPUT_FILE}`);
  helpers.writeArrayToJsonFile(transformedDocs, outputPath);
}

runTransform();
