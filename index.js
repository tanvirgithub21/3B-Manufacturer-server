const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
const { get } = require('express/lib/response');
const res = require('express/lib/response');
require('dotenv').config();
const app = express();

const port = process.env.PORT || 5000;

//middleware
app.use(cors())
app.use(express.json())




const uri = "mongodb+srv://barishalgadgetstore:MldV5qq33YBWkO5J@cluster0.kpxed.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
      await client.connect();
      const gadgetCollection = client.db('allItems').collection('item')
      // Query for a movie that has the title 'Back to the Future'

      
      //get all items
      //url : http://localhost:5000/allItems
      app.get("/allItems", async(req, res) =>{
        const query = req.query;
        const cursor = gadgetCollection.find(query)
        const result = await cursor.toArray()
        res.send(result)
      })

      //get single items
      //url : http://localhost:5000/item/id number
      app.get("/item/:_id", async(req, res) =>{
        const id  = req.params._id;
        const query = {_id: ObjectId(id)}
        const result = await gadgetCollection.findOne(query)
        res.send(result)
      })

      //update data
      //url : http://localhost:5000/item/update/enter your id
      app.put("/item/update/:_id", async(req, res)=>{
        const data = req.body;
        const itemId = req.params._id;
        const query = {_id: ObjectId(itemId)};
        const updateDocument = {
          $set: { ...data }
        };
        const result = await gadgetCollection.updateOne(query, updateDocument);
        res.send(result)
      } )
      

      //delete data
      //url : http://localhost:5000/item/delete?id=idnumber
      app.delete("/item/delete", async(req, res) =>{
        const { id } = req.query;
        const filter = {_id: ObjectId(id)}
        const deleteResult = await gadgetCollection.deleteOne(filter);
        res.send(deleteResult)
      })
      


      //Add new item
      //url : http://localhost:5000/addItem
      app.post( "/addItem" , async(req, res) =>{
        const data = req.body;
        const result = await gadgetCollection.insertOne(data);
        res.send(result)
      })
      

    } finally {
      // Ensures that the client will close when you finish/error
    //   await client.close();
    }
  }
  run().catch(console.dir);


app.listen(port, ()=>{
console.log('listen to port, ', port);
})

//pass MldV5qq33YBWkO5J