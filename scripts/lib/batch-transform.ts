import helpers from './helpers';

function filterDocFunction(doc) {
  // write filtering logic here
  return doc.primary_position.includes('Member of Parliament');
}

function filterDocuments(documents) {
  return documents.filter(filterDocFunction);
}

function transformDocument(doc) {
  let result = { ...doc };
  const parliamentaryConstituency = doc.primary_position.replace(
    'Member of Parliament for ',
    ''
  );
  result.mp_for = parliamentaryConstituency;
  return result;
}

function batchTransform(documents) {
  let filteredDocuments = filterDocuments(documents);
  return filteredDocuments.map(doc => transformDocument(doc));
}

export default batchTransform;
