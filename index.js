// require("dotenv").config();
const express = require("express");
const app = express();
const setupSwagger = require("./swagger/swagger.js");
const appRoutes = require("./routes/appRoutes.js");


app.use(express.json());

app.use("/", appRoutes);

setupSwagger(app);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log("Server running on", PORT);
});