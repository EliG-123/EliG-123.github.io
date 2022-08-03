if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

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

app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});

