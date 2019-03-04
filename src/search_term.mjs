import elasticsearch from 'elasticsearch';

const client = new elasticsearch.Client({
  host: '127.0.0.1:9200',
  log: 'error'
});

function search({ index, body }) {
  return client.search({ index, body });
}

export default function searchTerm() {
  const body = {
    "query": {
      "match": {
        "journal": "Fir"
      }
    }
  };

  console.log(`retrieving documents whose journal matches '${body.query.match.journal}' (displaying ${body.size} items at a time)...`);
  search('library', body).then(results => {
    console.log(`found ${results.hits.total} items in ${results.took}ms`);
    if (results.hits.total > 0) {
      console.log('returned journals:');
      results.hits.hits.forEach(hit => console.log(hit._source.journal));
    }
  }).catch(console.error);
}
