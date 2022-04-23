import express from "express";
import { notFoundException } from "./error";
import { getAnswers, getQuestion } from "./query";

const router = express.Router();

router.get(
  "/:questionGroupId/questions/:questionId",
  async (req: express.Request, res: express.Response, next) => {
    const question = await getQuestion(
      req.params.questionGroupId,
      req.params.questionId
    ).catch(next);
    if (!question) {
      return notFoundException();
    }
    question.answers = getAnswers(question.id).catch(next);
    res.send(question);
  }
);

export default router;
