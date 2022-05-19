const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
const { get } = require("express/lib/response");
const res = require("express/lib/response");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const app = express();

const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://barishalgadgetstore:MldV5qq33YBWkO5J@cluster0.kpxed.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const gadgetCollection = client.db("allItems").collection("item");
    // Query for a movie that has the title 'Back to the Future'

    function verifyJWT(req, res, next) {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).send({ message: "Unauthorized Access" });
      }

      jwt.verify(authHeader, process.env.ACCESS_TOKEN, (err, decoded) => {
        if (err) {
          return res.status(403).send({ message: "Forbidden Access" });
        }
        req.decoded = decoded;
        next();
      });
    }



    //get all items
    //url : http://localhost:5000/allItems
    app.get("/allItems", async (req, res) => {
      const query = req.query;
      const cursor = gadgetCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    //get single items
    //url : http://localhost:5000/item/id number
    app.get("/item/:_id", async (req, res) => {
      const id = req.params._id;
      const query = { _id: ObjectId(id) };
      const result = await gadgetCollection.findOne(query);
      res.send(result);
    });

    //update data
    //url : http://localhost:5000/item/update/enter your id
    app.put("/item/update/:_id", async (req, res) => {
      const data = req.body;
      const itemId = req.params._id;
      const query = { _id: ObjectId(itemId) };
      const updateDocument = {
        $set: { ...data },
      };
      const result = await gadgetCollection.updateOne(query, updateDocument);
      res.send(result);
    });

    //delete data
    //url : http://localhost:5000/item/delete/id number
    app.delete("/item/delete/:_id", async (req, res) => {
      const id = req.params._id;
      const filter = { _id: ObjectId(id) };
      const deleteResult = await gadgetCollection.deleteOne(filter);
      res.send(deleteResult);
    });

    //Add new item
    //url : http://localhost:5000/addItem
    app.post("/addItem", verifyJWT, async (req, res) => {
      const decodedEmail = req.decoded.email;
      const email = req.headers.email;
      console.log(decodedEmail, email);
      if (decodedEmail === email) {
        const data = req.body;
        const result = await gadgetCollection.insertOne(data);
        res.send(result);
      } else {
        res.status(403).send({ message: "Forbidden Access" });
      }
    });

    //verified jwt token
    //url : http://localhost:5000/verifiedToken
    app.post("/verifiedToken", async (req, res) => {
      const email = req.body;
      const token = jwt.sign(email, process.env.ACCESS_TOKEN, {
        expiresIn: "1d",
      });
      res.send({ token });
    });


  } finally {
    // Ensures that the client will close when you finish/error
    //   await client.close();
  }
}
run().catch(console.dir);

app.get( "/", (req , res)=>{
  res.send("ok")
})

app.listen(port, () => {
  console.log("listen to port, ", port);
});



//pass MldV5qq33YBWkO5J
