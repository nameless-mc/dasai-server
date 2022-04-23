import { type } from "os";
import connection, { idgen } from "./db";

export default class QuestionGroupBuilder {
  private questionGroupTitle: string;
  private desc = "";
  private questions: Array<Question>;
  private results: Array<QuestionGroupResult>;
  private firstQuestion?: Question;
  constructor(title: string) {
    this.questionGroupTitle = title;
    this.questions = [];
    this.results = [];
  }

  public description(desc: string) {
    this.desc = desc;
    return this;
  }

  public question(text: string, type: number) {
    const question: Question = {
      text: text,
      type: type,
      answers: [],
    };
    this.questions.push(question);
    if (!this.firstQuestion) {
      this.firstQuestion = question;
    }
    return new QuestionBuilder(question);
  }

  public result(text: string): QuestionGroupResult {
    const result = { text: text };
    this.results.push(result);
    return result;
  }

  public async build() {
    const self = this;
    const groupId = idgen();
    console.log("insert 'question_groups'...");
    await connection().then((c) => {
      c.query(
        "insert into question_groups(id, title, description) values(?, ?, ?)",
        [groupId, self.questionGroupTitle, self.desc]
      );
      c.end();
    });
    console.log("insert 'question_group_results'...");
    for (const qgr of this.results) {
      qgr.id = idgen();
      await connection().then((c) => {
        c.query(
          "insert into question_group_results(id, question_group_id, text, redirect_url) values (?, ?, ?, null)",
          [qgr.id, groupId, qgr.text]
        );
        c.end();
      });
    }
    console.log("insert 'questions'...");
    for (const q of this.questions) {
      q.id = idgen();
      await connection().then((c) => {
        c.query(
          "insert into questions(id, question_group_id, text, type) values(?, ?, ?, ?)",
          [q.id, groupId, q.text, q.type]
        );
        c.end();
      });
    }
    console.log("insert 'first_questions'...");
    await connection().then((c) => {
      c.query(
        "insert into first_questions(question_group_id, question_id) values(?, ?)",
        [groupId, this.firstQuestion?.id]
      );
    });
    console.log("insert 'answers'...");
    for (const q of this.questions) {
      for (const a of q.answers) {
        a.id = idgen();
        await connection().then((c) => {
          c.query(
            "insert into answers(id, question_id, text) values(?, ?, ?)",
            [a.id, q.id, a.text]
          );
          c.end();
        });
        await connection().then((c) => {
          c.query(
            "insert into answer_results(answer_id, next_question_id, question_result_id) values(?, ?, ?)",
            [a.id, a.next?.id, a.result?.id]
          );
          c.end();
        });
      }
    }
    console.log("insert finish");
  }
}

type Question = {
  id?: string;
  text: string;
  type: number;
  answers: Array<Answer>;
};

type Answer = {
  id?: string;
  text: string;
  next?: Question;
  result?: QuestionGroupResult;
};

type QuestionGroupResult = {
  id?: string;
  text: string;
};

class QuestionBuilder {
  private question: Question;
  constructor(question: Question) {
    this.question = question;
  }

  public answer(text: string): Answer {
    const answer = { text: text };
    this.question.answers.push(answer);
    return answer;
  }

  public getQuestion() {
    return this.question;
  }
}
