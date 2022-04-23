import express from "express";
import config from "./config";
import errorHandler from "./error";
import questionGroupResource from "./question_group_resource";
import questionResource from "./question_resource";
const app: express.Express = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CROS対応（というか完全無防備）
app.use(
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "*");
    res.header("Access-Control-Allow-Headers", "*");
    next();
  }
);

app.listen(config.port, () => {
  console.log("Start on port 3000.");
});

app.use("/api/question_groups", questionGroupResource);

app.use("/api/question_groups", questionResource);

app.use(errorHandler);
