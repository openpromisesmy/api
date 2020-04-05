import batchRead from './batch-read';

async function runRead() {
  try {
    const result = await batchRead();
  } catch (e) {
    console.error(e);
  }
}

runRead();
