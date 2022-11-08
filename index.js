const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 1000;
const { MongoClient, ServerApiVersion } = require("mongodb");
require('dotenv').config();

// middleware
app.use(cors());
app.use(express.json());

// env variable datas
const user = process.env.DB_USER;
const password = process.env.PASS

// mongodb and api
const uri = `mongodb+srv://${user}:${password}@cluster0.nvx6pod.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const servicesCollection= client.db('tDrawing').collection('services')

    // all services api
      app.get("/services", async (req, res) => {
        const query = {};
        const cursor = servicesCollection.find(query);
        const services = await cursor.toArray();
        res.send(services);
      });

    
  } finally {
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('T-Drawing server running...');
})

app.listen(port, () => {
    console.log(`T-Drawing Server running on port ${port}`);
})