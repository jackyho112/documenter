import express from 'express';
import elasticsearch from 'elasticsearch';
import fs from 'fs';

import verify from './src/verify';
import searchData from './src/search';
import searchTerm from './src/search_term';

const app = express();

const PORT = 5000;

const searchClient = new elasticsearch.Client({
    host: '127.0.0.1:9200',
    log: 'error'
 });

searchClient.ping({ requestTimeout: 30000 }, function(error) {
  if (error) {
    console.error('elasticsearch cluster is down!');
  } else {
    console.log('Everything is ok');
  }
});

function bulkIndex(index, type, data) {
  let bulkBody = [];

  data.forEach(item => {
    bulkBody.push({
      index: {
        _index: index,
        _type: type,
        _id: item.id
      }
    });

    bulkBody.push(item);
  });

  searchClient.bulk({ body: bulkBody }).then(response => {
    let errorCount = 0;
    response.items.forEach(item => {
      if (item.index && item.index.error) {
        console.log(++errorCount, item.index.error);
      }
    });
    console.log(
      `Successfully indexed ${data.length - errorCount}
      out of ${data.length} items`
    );
  }).catch(console.err);
}

async function indexDataIfNoneFound() {
  const { count } = await searchClient.count();

  if (count > 0) {
    return;
  }

  const articlesRaw = await fs.readFileSync('./src/sample_data.json');
  const articles = JSON.parse(articlesRaw);
  console.log(`${articles.length} items parsed from data file`);
  bulkIndex('library', 'article', articles);
}

// indexDataIfNoneFound();
// verify();
// searchData();
searchTerm();

app.listen(PORT, function() {
  console.log('Server is running on PORT:', PORT);
});
