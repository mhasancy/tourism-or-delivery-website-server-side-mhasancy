//imported file
const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.86fnr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("travelNowMaster");
    const servicesCollection = database.collection("services");
    const ordersCollection = database.collection("orders");

    //data load to the services
    app.get("/services", async (req, res) => {
      const cursor = servicesCollection.find({});
      const services = await cursor.toArray();
      res.send(services);
    });

    //data load to the orders
    app.get("/orders", async (req, res) => {
      const cursor = ordersCollection.find({});
      const orders = await cursor.toArray();
      res.send(orders);
    });

    //data adding to the services
    app.post("/services", async (req, res) => {
      const service = req.body;
      const result = await servicesCollection.insertOne(service);
      res.json(result);
    });
    //data adding to the orders
    app.post("/orders", async (req, res) => {
      const order = req.body;
      const result = await ordersCollection.insertOne(order);
      res.json(result);
      console.log(result);
    });
    //data deleting from the orders
    app.delete("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await ordersCollection.deleteOne(query);
      res.json(result);
    });
    //data updating from  pending to approved
    app.put("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const requestedStatus = req.body;
      const filter = { _id: ObjectId(id) };
      const option = { upsert: true };
      const statusChange = {
        $set: {
          status: requestedStatus.status,
        },
      };
      const result = await ordersCollection.updateOne(
        filter,
        statusChange,
        option
      );
      res.json(result);
    });
  } finally {
    // Ensures that the client will close when you finish/error
    //   await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Travel Now server is running.");
});

app.listen(port, () => {
  console.log("Running on port ", port);
});
