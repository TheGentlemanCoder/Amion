const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 5000;

const app = express();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, './avistad-frontend/build')));

app.get('/api', (req, res) => {
    res.json({message: 'Hello world!'});
});

app.listen(PORT, () => {
    console.log(`[*] Backend server listening on :${PORT}...`);
});