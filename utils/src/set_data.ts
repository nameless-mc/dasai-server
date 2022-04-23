import { exit } from "process";
import { clearDB } from "./db";
import QuestionGroupBuilder from "./question_fixture";

clearDB().then(() => {
  const builder = new QuestionGroupBuilder("test").description(
    "test questions"
  );

  const q1 = builder.question("q1", 0);
  const a1_1 = q1.answer("a1-1");
  const a1_2 = q1.answer("a1-2");

  const q2 = builder.question("q2", 0);
  const a2_1 = q2.answer("a2-1");
  const a2_2 = q2.answer("a2-2");
  const a2_3 = q2.answer("a2-3");

  a1_1.next = q2.getQuestion();

  const q3 = builder.question("q3", 0);
  const a3_1 = q3.answer("a3-1");
  const a3_2 = q3.answer("a3-2");

  a1_2.next = q3.getQuestion();

  a2_1.next = q3.getQuestion();

  const q4 = builder.question("q4", 0);
  const a4_1 = q4.answer("a4-1");

  a2_2.next = q4.getQuestion();

  const r1 = builder.result("res1");
  const r2 = builder.result("res2");
  const r3 = builder.result("res3");
  const r4 = builder.result("res4");

  a2_3.result = r1;
  a3_1.result = r2;
  a3_2.result = r3;
  a4_1.result = r4;

  builder.build().then(() => {
    exit();
  });
});
