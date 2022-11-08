const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 1000;
require('dotenv').config();

// middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('T-Drawing server running...');
})

app.listen(port, () => {
    console.log(`T-Drawing Server running on port ${port}`);
})