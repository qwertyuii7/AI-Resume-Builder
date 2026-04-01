import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001; // Use different port to avoid conflicts

app.get('/', (req, res) => {
  res.send('Simple test server running on port ' + PORT);
});

app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
});
