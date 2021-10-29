const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://Admin:MnNeX17mrsoJWsNN@cluster0.86fnr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("travelNowMaster");
    const servicesCollection = database.collection("services");
    const travelersCollection = database.collection("travelers");
    // Query for a movie that has the title 'Back to the Future'

    app.get("/services", async (req, res) => {
      const cursor = servicesCollection.find({});
      const services = await cursor.toArray();
      res.send(services);
    });

    app.get("/travelers", async (req, res) => {
      const cursor = travelersCollection.find({});
      const travelers = await cursor.toArray();
      res.send(travelers);
    });
    //post
    app.post("/services", async (req, res) => {
      const service = req.body;
      const result = await servicesCollection.insertOne(service);
      res.json(result);
    });
  } finally {
    // Ensures that the client will close when you finish/error
    //   await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("A-11 server is running.");
});

app.listen(port, () => {
  console.log("Running on port ", port);
});
