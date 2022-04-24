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