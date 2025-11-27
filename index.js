require("dotenv").config();
const express = require("express");
const app = express();
const setupSwagger = require("./swagger/swagger.js");
const appRoutes = require("./routes/appRoutes.js");
const BASE_URL = process.env.BASE_URL;


app.use(express.json());

app.use("/", appRoutes);

setupSwagger(app);

app.listen(3003, () => console.log("Server running on 3003"))