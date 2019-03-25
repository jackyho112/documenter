import elasticsearch from 'elasticsearch';

const client = new elasticsearch.Client({
  host: '127.0.0.1:9200',
  log: 'error',
});

function clientSearch(index, body) {
  return client.search({ index, body });
}

export default function search(text) {
  const body = {
    "query": {
      "more_like_this": {
        "fields": [
          "title",
          "shortDescription",
          "longDescription",
          "authors",
          "categories"
        ],
        "like": text
      }
    }
  }

  return clientSearch('catalog', body).catch(console.error);
};
