
const express= require('express')
const bodyParser = require('body-parser')
const route = require("./routes/route.js");
const mongoose = require('mongoose')
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


mongoose
  .connect(
    "mongodb+srv://suryask:mongo302@mycluster1.ogvku.mongodb.net/Group2-DB?authSource=admin&replicaSet=atlas-ryoz1b-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true",
    {
      useNewUrlParser: true,
    }
  )
  .then(() => console.log("MongoDb is connected"))
  .catch((err) => console.log(err));

app.use("/", route);

app.listen(process.env.PORT || 3000, function () {
  console.log("Express app running on port " + (process.env.PORT || 3000));
});

