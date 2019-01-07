import elasticsearch from 'elasticsearch';

const searchClient = new elasticsearch.Client({
  host: '127.0.0.1:9200',
  log: 'error'
});

function indices() {
  return (
    searchClient
      .cat.indices({ v: true })
      .then(console.log)
      .catch(err =>
        console.log(`Error connecting to the es client: ${err}`)
      )
  );
}

function verify() {
  console.log(`elasticsearch indices information`);
  indices();
}

export default verify;
