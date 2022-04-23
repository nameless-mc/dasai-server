import * as mysql from "promise-mysql";
import config from "./config";

const connection = async () => {
  return await mysql.createConnection(config.db);
};

export default connection;
