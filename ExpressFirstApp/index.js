const express = require('express');
const staticRoutes = require('./routes/staticRoutes');
const app = express();

app.use('/static', express.static('public'));
app.use('/static', staticRoutes);

app.get('/', (req, res) => {
  res.set({ 'Content-Type': 'text/html' });
  res.send('Hi');
});

app.use((req, res) => {
  res
    .status(404)
    .sendFile('public/notFoundErrorPage.html', { root: __dirname });
});

app.listen(3000);
