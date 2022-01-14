const express = require('express');
const app = express();

app.get('/api', (req, res) => {
    res.json({message: 'Hello world!'});
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`[*] Backend server listening on :${PORT}...`);
});