import express from "express";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import cors from "cors";
import path from "path";
import router from "./routes";
import createTables from "./db/migrations";
import error from "./middlewares/error";

const swaggerDocument = YAML.load("./server/docs/docs.yaml");
const app = express();

createTables();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(express.static("UI"));
app.use("/api/v1/", router);
app.all("*", (req, res) => {
  res.status(404).json({
    message: "Invalid route. Please check that the link is correct?"
  });
});
app.use(error);

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`listening on port ${port}....`);
});

export default app;
