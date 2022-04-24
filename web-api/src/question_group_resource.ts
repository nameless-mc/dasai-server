import express from "express";
import connection, { idgen } from "./db";
import { notFoundException } from "./error";
import { getAnswers, getQuestion, getQuestionGroup } from "./query";

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
    const questionGroup = await getQuestionGroup(
      req.params.questionGroupId
    ).catch(next);
    if (!questionGroup) {
      return next(notFoundException());
    }
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
      q.answers = await getAnswers(q.id).catch(next);
    }
    questionGroup.questions = questions;
    res.send(questionGroup);
  }
);

router.put(
  "/:questionGroupId/start",
  async (req: express.Request, res: express.Response, next) => {
    const questionGroup = await getQuestionGroup(
      req.params.questionGroupId
    ).catch(next);
    if (!questionGroup) {
      return next(notFoundException());
    }
    const firstQuestionlist = await connection()
      .then((c) => {
        return c.query(
          "SELECT q.text as text, q.id as id FROM first_questions as fq" +
            " left join questions as q on fq.question_id = q.id" +
            " left join question_groups as qg on fq.question_group_id = qg.id" +
            " where qg.id = " +
            req.params.questionGroupId
        );
      })
      .catch(next);
    if (!firstQuestionlist || firstQuestionlist.length == 0) {
      return next(notFoundException());
    }
    const firstQuestion = firstQuestionlist[0];
    firstQuestion.answers = await getAnswers(firstQuestion.id).catch(next);
    const userAnswerId = idgen();
    await connection()
      .then((c) => {
        c.query(
          "insert into user_answers(id, question_group_id) values (?, ?)",
          [userAnswerId, questionGroup.id]
        );
      })
      .catch(next);
    res.send({
      user_answer_id: parseInt(userAnswerId),
      question_group_id: questionGroup.id,
      question: firstQuestion,
    });
  }
);
router.post(
  "/:questionGroupId/answer",
  async (req: express.Request, res: express.Response, next) => {
    const userAnswerId = req.body.user_answer_id;
    const questionId = req.body.question_id;
    const answerId = req.body.answer_id;
    const questionGroupId = req.params.questionGroupId;

    const answer_results = await connection()
      .then((c) => {
        return c.query(
          "select * from answer_results as ar" +
            " where ar.answer_id = " +
            answerId
        );
      })
      .catch(next);
    if (!answer_results || answer_results.length == 0) {
      return next(notFoundException());
    }
    const question = await getQuestion(questionGroupId, questionId).catch(next);
    if (!question) {
      return next(notFoundException());
    }
    const userAnswer = await connection()
      .then((c) => {
        return c.query(
          "select * from user_answers as ua" + " where ua.id = " + userAnswerId
        );
      })
      .catch(next);
    if (!userAnswer) {
      return next(notFoundException());
    }
    await connection()
      .then((c) => {
        c.query(
          "insert into user_question_answers(user_answer_id, question_id, answer_id, text) values (?, ?, ?, null)",
          [userAnswerId, questionId, answerId]
        );
      })
      .catch(next);
    if (answer_results.question_result_id) {
      const questionGroupResults = await connection().then((c) => {
        return c.query(
          "select * from question_group_results as qgr" +
            " where qgr.id = " +
            answer_results.question_result_id
        );
      });
      if (!questionGroupResults || questionGroupResults.length == 0) {
        return next();
      }
      res.redirect(questionGroupResults[0].redirect_url);
      return;
    } else if (answer_results.next_question_id) {
      const nextQuestion = await getQuestion(
        questionGroupId,
        answer_results.next_question_id
      ).catch(next);
      nextQuestion.answers = await getAnswers(nextQuestion.id).catch(next);
      res.send({
        user_answer_id: userAnswerId,
        question_group_id: questionGroupId,
        question: nextQuestion,
      });
    }
  }
);

export default router;
