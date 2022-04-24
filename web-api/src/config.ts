import dotenv from "dotenv";
import path from "path";
import process from "process";

dotenv.config({ path: path.join(__dirname, "../data/.env") });

export default {
  /**
   * APIサーバーのPORT番号
   */
  port: parseInt(process.env.PORT || "3000", 10),

  /**
   * databaseの設定
   */
  db: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "3306", 10),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    multipleStatements: true,
  },
};
