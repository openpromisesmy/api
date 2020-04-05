import batchRead from './batch-read';

async function runRead() {
  try {
    const result = await batchRead();
    console.log({ matchedDocumentslength: result.matchedDocuments.length });
  } catch (e) {
    console.error(e);
  }
}

runRead();
