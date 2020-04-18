import batchRead from './lib/batch-read';
import config from './config';
import utils from './utils';

const filepath = config.READ.OUTPUT_DIR + config.READ.OUTPUT_FILE;

async function runRead() {
  try {
    const result = await batchRead();
    console.log({ matchedDocumentslength: result.matchedDocuments.length });
    utils.writeArrayToJsonFile(result.matchedDocuments, filepath);
  } catch (e) {
    console.error(e);
  }
}

runRead();
