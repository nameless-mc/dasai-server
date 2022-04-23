import express from "express";
import connection from "./db";
import { notFoundException } from "./error";

const router = express.Router();

router.get("/", (req: express.Request, res: express.Response) => {
  connection()
    .then((c) => {
      const result = c.query("SELECT * FROM question_groups");
      c.end();
      return result;
    })
    .then(function (data) {
      res.send({ question_groups: data });
    });
});

router.get(
  "/:questionGroupId",
  async (req: express.Request, res: express.Response, next) => {
    const questionGroups = await connection().then((c) => {
      return c.query(
        "SELECT * FROM question_groups as qg" +
          " where qg.id = " +
          req.params.questionGroupId
      );
    });
    if (questionGroups.length == 0) {
      return next(notFoundException());
    }
    const questionGroup = questionGroups[0];
    const questions = await connection()
      .then((c) => {
        return c.query(
          "SELECT id, text, type from questions as q " +
            "where q.question_group_id = " +
            req.params.questionGroupId
        );
      })
      .catch(next);
    for (const q of questions) {
      const answers = await connection()
        .then((c) => {
          return c.query(
            "SELECT id, text from answers as a " +
              "where a.question_id = " +
              q.id
          );
        })
        .catch(next);
      q.answers = answers;
    }
    questionGroup.questions = questions;
    res.send(questionGroup);
  }
);

export default router;
