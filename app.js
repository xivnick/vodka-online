
const express = require('express');
const app = express();
const http = require('http').createServer(app);

const port = process.env.PORT || 3333;

const bodyParser = require('body-parser');

app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(express.static('static'));

app.get('/', (req, res) => {
    return res.render('index.ejs');
});

http.listen(port, () => {
    console.log(`server is listening at localhost:${port}`);
});