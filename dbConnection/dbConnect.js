// const mongodb = require("mongodb");
const mongoose = require("mongoose");

const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@sociapp-mongo-dev-clust.ltdg9.mongodb.net/?retryWrites=true&w=majority&appName=sociapp-mongo-dev-cluster`


//connect to database
// module.exports = function () {  
//     mongoose.connect(uri, {useNewUrlParser: true});
//     console.log("Database connection established");
// }



const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };
async function run() {
  try {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    const res1 = await mongoose.connect(uri, clientOptions);
    // console.log(res1)
    const res2 = await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB! ", res2);
  } finally {
    // Ensures that the client will close when you finish/error
    // await mongoose.disconnect();
  }
}
run().catch(console.dir);

module.exports = run
