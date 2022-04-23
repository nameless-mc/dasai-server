import { stringify } from "querystring";
import connection from "./db";

export const getQuestionGroup = async (questionGroupId: string) => {
  const questionGroups = await connection().then((c) => {
    return c.query(
      "SELECT * FROM question_groups as qg" +
        " where qg.id = " +
        questionGroupId
    );
  });

  if (!questionGroups || questionGroups.length == 0) {
    return null;
  }
  return questionGroups[0];
};

export const getQuestion = async (
  questionGroupId: string,
  questionId: string
) => {
  const questions = await connection().then((c) => {
    return c.query(
      "SELECT id, text, type from questions as q " +
        "where q.question_group_id = " +
        questionGroupId +
        " and q.id = " +
        questionId
    );
  });
  if (!questions || questions.length == 0) {
    return null;
  }
  return questions[0];
};

export const getAnswers = async (questionId: string) => {
  return await connection().then((c) => {
    return c.query(
      "SELECT id, text from answers as a " +
        "where a.question_id = " +
        questionId
    );
  });
};
