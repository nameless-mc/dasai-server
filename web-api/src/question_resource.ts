import express from "express";
import connection from "./db";
import { notFoundException } from "./error";

const router = express.Router();

router.get(
  "/:questionId",
  async (req: express.Request, res: express.Response, next) => {
    const questions = await connection()
      .then((c) => {
        return c.query(
          "SELECT id, text, type from questions as q " +
            "where q.question_group_id = " +
            req.params.questionGroupId +
            " and q.id = " +
            req.params.questionId
        );
      })
      .catch(next);
    if (questions.length == 0) {
      return next(notFoundException());
    }
    const question = questions[0];
    const answers = await connection()
      .then((c) => {
        return c.query(
          "SELECT id, text from answers as a " +
            "where a.question_id = " +
            question.id
        );
      })
      .catch(next);
    question.answers = answers;
    res.send(question);
  }
);

export default router;
