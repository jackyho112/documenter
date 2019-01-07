import express from 'express';
import elasticsearch from 'elasticsearch';
import fs from 'fs';

const app = express();

const PORT = 5000;

const client = new elasticsearch.Client({
    host: '127.0.0.1:9200',
    log: 'error'
 });

app.listen(PORT, function() {
    console.log('Server is running on PORT:',PORT);
});
