import helpers from './helpers';

function filterDocFunction(doc) {
  // write filtering logic here
  return (
    doc.administration_name &&
    doc.administration_name.toLowerCase() === 'muhyiddin cabinet'
  );
}

function filterDocuments(documents) {
  return documents.filter(filterDocFunction);
}

function transformDocument(doc) {
  let result = { ...doc };
  result.cabinet_positions = {
    administration_name: 'Muhyiddin Cabinet',
    positions: [doc.primary_position]
  };
  return result;
}

function batchTransform(documents) {
  let filteredDocuments = filterDocuments(documents);
  return filteredDocuments.map(doc => transformDocument(doc));
}

export default batchTransform;
