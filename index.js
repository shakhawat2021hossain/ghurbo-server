const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

//middleware
app.use(cors());
app.use(express.json());

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

//db

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xxplp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect((err) => {
  const collection = client.db("travel").collection("offers");
  const orderCollection = client.db("travel").collection("orders");

  //get api (all data)
  app.get("/offers", async (req, res) => {
    const cursor = collection.find({});
    const offers = await cursor.toArray();
    res.send(offers);
  });
  app.get("/allOrders", async (req, res) => {
    const cursor = orderCollection.find({});
    const allOrders = await cursor.toArray();
    res.send(allOrders);
  });
  app.get("/orders/:email", async (req, res) => {
    const cursor = orderCollection.find({ email: req.params.email });
    const orders = await cursor.toArray();
    res.send(orders);
  });

  //snigle offer
  app.get("/offers/:id", async (req, res) => {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const offer = await collection.findOne(query);
    res.json(offer);
    // console.log(id);
  });

  //post api
  app.post("/offers", async (req, res) => {
    // console.log("hit the api", req.body);
    // res.send("servicessssssssss");
    const offer = req.body;
    const result = await collection.insertOne(offer);
    // console.log(result);
    res.json(result);
  });
  app.post("/addOrder", async (req, res) => {
    // console.log("hit the api", req.body);
    // res.send("servicessssssssss");
    const order = req.body;
    const result = await orderCollection.insertOne(order);
    // console.log(result);
    res.json(result);
  });

  //delete api
  app.delete("/orders/:id", async (req, res) => {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const result = await orderCollection.deleteOne(query);
    res.json(result);
  });
});
