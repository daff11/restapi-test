const express = require("express");
const app = express();
const setupSwagger = require("./swagger/swagger.js");
const appRoutes = require("./routes/appRoutes.js");

app.use(express.json());

setupSwagger(app);

app.get("/", (req, res) => {
  res.send("API OK");
});

const PORT = process.env.PORT;
app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on", PORT);
});
