const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 1000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require('dotenv').config();
const jwt = require("jsonwebtoken");

// middleware
app.use(cors());
app.use(express.json());

// env variable datas
const user = process.env.DB_USER;
const password = process.env.PASS
const Secret = process.env.ACCESS_TOKEN_SECRET;

// mongodb and api
const uri = `mongodb+srv://${user}:${password}@cluster0.nvx6pod.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

function verifyJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).send({ message: "Unauthorized access" });
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, Secret, function (err, decoded) {
    if (err) {
      res.status(401).send({ message: "Unauthorized access" });
    }
    req.decoded = decoded;
    next();
  });
}

async function run() {
  try {
      const servicesCollection = client.db('tDrawing').collection('services')
      
      //jwt api
      app.post("/jwt", (req, res) => {
        const user = req.body;
        console.log(user);
        const token = jwt.sign(user, Secret, { expiresIn: "1000d" });
        res.send({ token });
      });

    //* all services api
      
    //   get services data
      app.get("/services", async (req, res) => {
        const query = {};
        const count = parseInt(req.query.count);
        if (count) {
          const cursor = servicesCollection.find(query);
          const services = await cursor.limit(count).toArray();
          res.send(services);
        } else {
          const cursor = servicesCollection.find(query);
          const services = await cursor.toArray();
          res.send(services);
          }
          
          // get a single service
          app.get("/services/:id", async (req, res) => {
              const id = req.params.id;
              const query = { _id: ObjectId(id) };
              const service = await servicesCollection.findOne(query);
            //   console.log(service);
              res.send(service);
          });

        //   post a single service
        app.post("/services", verifyJWT, async (req, res) => {
          const service = req.body;
          console.log(service);
          const result = await servicesCollection.insertOne(service);
          res.send(result);
        });
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