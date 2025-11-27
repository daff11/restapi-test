// require("dotenv").config();
const express = require("express");
const app = express();
const setupSwagger = require("./swagger/swagger.js");
const appRoutes = require("./routes/appRoutes.js");


app.use(express.json());

app.use("/", appRoutes);

setupSwagger(app);

app.listen(process.env.DB_HOST, () => console.log(`Server running on ${process.env.DB_PORT}`))