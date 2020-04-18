import helpers from './helpers';

function filterDocFunction(doc) {
  // write filtering logic here
  return true;
}

function filterDocuments(documents) {
  return documents.filter(filterDocFunction);
}

function transformDocument(doc) {
  return doc;
}

function batchTransform(documents) {
  let filteredDocuments = filterDocuments(documents);
  return filteredDocuments.map(doc => transformDocument(doc));
}

export default batchTransform;
