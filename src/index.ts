import cors from "cors";
import express from "express";
import routes from "./routes/index.routes";
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use("/", routes);
app.listen(5000, () => {
  console.log("🚀 Server ready at: http://localhost:5000");
});