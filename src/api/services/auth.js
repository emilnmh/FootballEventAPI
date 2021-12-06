const { Pool } = require("pg");
const ServerError = require("../../lib/error");
const bcrypt = require("bcryptjs");

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  max: 1,
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 2000,
});

/**
 * @param {Object} options
 * @param {Object} options.body Username and password to be authorized.
 * @throws {Error}
 * @return {Promise}
 */
module.exports.authUser = async (options) => {
  if (
    options.hasOwnProperty("body") &&
    options.body !== undefined &&
    options.body.hasOwnProperty("username") &&
    options.body.hasOwnProperty("password")
  ) {
    try {
      const client = pool.connect();

      const query = "SELECT * FROM users WHERE username = $1";
      const values = [options.body.username];

      const res = await client.query(query, values);

      client.end();

      const user = res.rows[0];

      if (bcrypt.compareSync(options.body.password, user.password)) {
        delete user.password;

        return {
          status: 200,
          data: user,
          message: "OK",
        };
      } else {
        return {
          status: 400,
          error: "Invalid input",
        };
      }
    } catch (error) {
      console.log(error);

      throw new ServerError({
        status: 500,
        error: "Server Error",
      });
    }
  } else {
    return {
      status: 400,
      error: "Invalid input",
    };
  }
};
