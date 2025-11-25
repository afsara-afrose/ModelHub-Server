const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://AIModelHub:qjryPmCLcBMiB7G3@cluster0.l0hikio.mongodb.net/?appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    const db = client.db("AIModelHub");
    const modelCollection = db.collection("models");

    app.get("/models", async (req, res) => {
      const result = await modelCollection.find().toArray();
      res.send(result);
    });

    //ADD get api for collecting data  from client to server
    app.post("/add-model", async (req, res) => {
      const newModel = req.body;
      console.log("Received Model", newModel);
      const result = await modelCollection.insertOne(newModel);
      res.send({
        success: true,
        result,
      });
    });

    
    //For  single Model Model Details page
    app.get("/models/:id", async (req, res) => {
      const { id } = req.params;
      console.log(id);
      const objectId = new ObjectId(id);
      const result = await modelCollection.findOne({ _id: objectId });
      res.send({
        success: true,
        result,
      });
    });

    //using put api for putting updated data to mongodb
    app.put('/update-model/:id',async (req,res)=>{
        const {id}=req.params
        const data=req.body
        console.log(data)
        const objectId = new ObjectId(id);
        const filter={_id:objectId}
        const update={
            $set:data
        }
        
      const result = await modelCollection.updateOne(filter,update);
      res.send({
        success:true,
        result,

      })
        
    })
    //my model page 
    app.get('/my-models',async(req,res)=>{
        const email=req.query.email
        const result =await modelCollection.find({createdBy:email}).toArray()
        res.send({
            success:true,
            result
         })
    })

    //Delete Model
    app.delete('/models/:id',async(req,res)=>{
        const {id}=req.params
         const objectId = new ObjectId(id);
         const result = await modelCollection.deleteOne({_id:objectId});
         res.send({
            success:true,
            result
         })


    })



   
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});



