const sql = require("../../sql/sql");

require("dotenv").config();

/**
 * @param {Object} options
 * @throws {Error}
 * @return {Promise}
 */
module.exports.getFields = async (options) => {

  const res = await sql.query(`SELECT * FROM fields`);

  return res.rows
};
