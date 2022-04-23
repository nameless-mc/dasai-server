import * as mysql from "promise-mysql";
import config from "./config";

const connection = async () => {
  return await mysql.createConnection(config.db);
};

export default connection;

export const idgen = () => {
  return (Date.now() % 10000) + getRandomInt(100, 999).toString();
};

export const getRandomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
};

export const clearDB = async () => {
  const deleteQuery = await connection().then((c) => {
    return c.query(
      "SELECT GROUP_CONCAT(CONCAT('TRUNCATE TABLE ',table_name,';') SEPARATOR ' ') AS statement" +
        " FROM information_schema.tables" +
        " WHERE table_schema = 'dassai'"
    );
  });
  if (deleteQuery[0].statement) {
    await connection().then(async (c) => {
      await c.query("set foreign_key_checks = 0");
      await c.query(deleteQuery[0].statement);
      await c.query("set foreign_key_checks = 1");
      await c.end();
    });
  }
  console.log("clear db data");
};
