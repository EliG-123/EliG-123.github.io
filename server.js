if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
require("dotenv").config();
const express = require("express");
const app = express();
const bcrypt = require('bcrypt')
const expressLayouts = require("express-ejs-layouts");
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken')


const indexRouter = require("./routes/index");
const sleepRouter = require("./routes/sleep");
const surveyRouter = require("./routes/surveys")
const accountsRouter = require("./routes/accounts")

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.set("layout", "layouts/layout");

app.use(expressLayouts);
app.use(express.static("public"));
app.use('/public', express.static('public'))
app.use(bodyParser.urlencoded({ limit : '10mb', extended : false }))



const mongoose = require("mongoose");
// mongoose.connect(process.env.DATABASE_URL, { 
//   useNewUrlParser : true,
//   useUnifiedTopology: true,
// });

mongoose.connect(process.env.DATABASE_URL, { 
  useNewUrlParser : true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", (error) => {
  console.error(error);
});
db.once("open", () => console.log("connected to mongoose"));


app.use("/", indexRouter);
app.use("/sleep", sleepRouter);
app.use("/surveys", surveyRouter);
app.use("/accounts", accountsRouter)


// const { MongoClient, ServerApiVersion } = require('mongodb');
// const fs = require('fs');
// const credentials = 'X509-cert-6598356970123720114.cer'
// const client = new MongoClient('mongodb+srv://cluster0.hwlla.mongodb.net/?authSource=%24external&authMechanism=MONGODB-X509&retryWrites=true&w=majority', {
//   sslKey: credentials,
//   sslCert: credentials,
//   serverApi: ServerApiVersion.v1
// });
// async function run() {
//   try {
//     await client.connect();
//     const database = client.db("testDB");
//     const collection = database.collection("testCol");
//     const docCount = await collection.countDocuments({});
//     console.log(docCount);
//     // perform actions using client
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);


app.listen(process.env.PORT || 3000, () => {
  console.log("Running");
});



