const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = 3000;

const corsConfig = {
  origin: "*",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
};
app.use(cors(corsConfig));
app.options("*", cors(corsConfig));

app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://The-Learn-Cloud-job-task:sRy7G3EmyTgjevUn@cluster0.pwifs1n.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const theLearnCloudJobTaskDB = client.db("the-learn-cloud-job-task");
    const todoCollection = theLearnCloudJobTaskDB.collection("todoCollection");

    //getting todos
    app.get("/", async (req, res) => {
      const result = await todoCollection.find({}).toArray();
      res.send(result);
    });

    //posting todo.
    app.post("/addTodo", async (req, res) => {
      const body = req.body;
      body.createdAt = new Date();
      body.status = "uncompleted";
      // console.log(body);
      const result = await todoCollection.insertOne(body);
      if (result?.insertedId) {
        return res.status(200).send(result);
      } else {
        return res.status(404).send({
          message: "can not insert try again leter",
          status: false,
        });
      }
    });

    // update order after dragging table raw
    app.put("/updateOrder", async (req, res) => {
      const { newOrder } = req.body;

      // console.log('Received new order:', newOrder);

      try {
        // Iterate through the new order array and update the order for each item
        for (let i = 0; i < newOrder.length; i++) {
          const itemId = newOrder[i];
          const realId = { _id: new ObjectId(itemId) };
          console.log("here is id", itemId);
          const updatedDoc = { $set: { order: Number(i) + 1 } };
          console.log("Before");
          const result = await todoCollection.updateOne(realId, updatedDoc);
          console.log("After");
        }

        // console.log("success");
        res.status(200).json({ message: "Order updated successfully" });
      } catch (error) {
        console.error("Error updating order:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    // update status after clicking on the checkbox
    app.put("/updateStatus", async (req, res) => {
      const { status, id } = req.body;
      let newStatus;
      // console.log(status,id);

      try {
        // Iterate through the new order array and update the order for each item
        if (status === "uncompleted") {
          newStatus = "completed";
        } else {
          newStatus = "uncompleted";
        }
        const realId = { _id: new ObjectId(id) };
        const updatedDoc = { $set: { status: newStatus } };
        const result = await todoCollection.updateOne(realId, updatedDoc);

        // console.log("success");
        res.status(200).json({ message: "Order updated successfully" });
      } catch (error) {
        console.error("Error updating order:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    // make title line through after clicking on it.
    app.put("/isLine", async (req, res) => {
      const { isLine, id } = req.body;
      console.log("Is Line", isLine);
      let newline;
      // console.log(status,id);

      try {
        // Iterate through the new order array and update the order for each item
        if (isLine === "true") {
          newline = "false";
        } else {
          newline = "true";
        }
        const realId = { _id: new ObjectId(id) };
        const updatedDoc = { $set: { line: newline } };
        const result = await todoCollection.updateOne(realId, updatedDoc);

        // console.log("success");
        res.status(200).json({ message: "Order updated successfully" });
      } catch (error) {
        console.error("Error updating order:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
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
