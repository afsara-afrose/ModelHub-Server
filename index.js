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



