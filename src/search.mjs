import elasticsearch from 'elasticsearch';

const client = new elasticsearch.Client({
  host: '127.0.0.1:9200',
  log: 'error',
});

function search(index, body) {
  return client.search({ index, body });
}

export default function searchData() {
  const body = {
    size: 4,
    from: 0,
    query: {
      match_all: {}
    }
  };

  search('library', body).then(results => {
    console.log(`found ${results.hits.total} items in ${results.took}ms`);
    console.log('returned journals:');
    results.hits.hits.forEach((hit, index) => console.log(
      hit._source.journal
    ));
  }).catch(console.error);
};
