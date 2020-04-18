import helpers from './helpers';

function transformDocument(doc) {
  // console.log(doc);
}

function batchTransform(documents) {
  documents.forEach(doc => transformDocument(doc));
}

export default batchTransform;
