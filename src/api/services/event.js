const { Pool } = require("pg");
const ServerError = require("../../lib/error");

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
 * @param {Integer} options.field_id The field id
 * @throws {Error}
 * @return {Promise}
 */
module.exports.getEventsOfField = async (options) => {
  try {
    const client = pool.connect();

    const query =
      "SELECT events.* FROM events, fields WHERE events.field = field.id AND field.id = $1";
    const values = [options.field_id];

    const res = await client.query(query, values);
    client.release();

    return {
      status: 200,
      data: res,
    };
  } catch (error) {
    throw new ServerError({
      status: 500,
      error: "Server Error",
    });
  }
};

/**
 * @param {Object} options
 * @param {Integer} options.field_id The field id
 * @param {Object} options.body
 * @throws {Error}
 * @return {Promise}
 */
module.exports.createEvent = async (options) => {
  if (
    options.body !== undefined &&
    options.body.max_participants &&
    Number.isInteger(options.body.max_participants) &&
    options.body.max_participants >= 6 &&
    options.body.owner &&
    options.body.description &&
    options.body.start_time &&
    options.body.end_time
  ) {
    const startTime = new Date(options.body.start_time * 1000);
    const endTime = new Date(options.body.end_time * 1000);
    const maxEndTime = new Date(
      startTime.getFullYear(),
      startTime.getMonth(),
      startTime.getDate() + 2
    );

    // Check that the time frame can only be in 1 day.
    if (
      options.body.start_time < options.body.end_time &&
      endTime <= maxEndTime
    ) {
      try {
        const client = await pool.connect();

        // Checks to see if it is a valid time frame.
        const query1 =
          "SELECT id FROM events WHERE field = $1 AND ((start_time <= $2 AND $2 < end_time) OR ($3 < start_time AND $3 <= end_time))";
        const values1 = [options.field_id, startTime, endTime];
        const res1 = await client.query(query1, values1);

        if (res1.rowCount === 0) {
          // if it is a valid time frame.
          const query2 =
            "INSERT INTO events (field, max_participants, owner, description, start_time, end_time) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id";
          const values2 = [
            options.field_id,
            options.body.max_participants,
            options.body.owner,
            options.body.description,
            startTime,
            endTime,
          ];

          const res2 = await client.query(query2, values2);

          // Insert owner into participants.
          const query3 =
            "INSERT INTO participants (event_id, user_id) VALUES ($1, $2)";
          const values3 = [res2.rows[0].id, options.body.owner];
          const res3 = await client.query(query3, values3);

          client.release();

          return {
            status: 200,
            message: "OK",
          };
        }
        client.release();
      } catch (error) {
        throw new ServerError({
          status: 500,
          error: "Server Error",
        });
      }
    }
  }

  return {
    status: 400,
    error: "Invalid input",
  };
};

/**
 * @param {Object} options
 * @param {Object} options.event_id
 * @throws {Error}
 * @return {Promise}
 */
module.exports.joinEvent = async (options) => {
  if (options.body && options.event_id && options.body.user_id) {
    try {
      const client = await pool.connect();

      const query =
        "SELECT * FROM participants, events WHERE event_id = $1 AND event_id = id";
      const values = [options.event_id];
      const res = await client.query(query, values);

      if (res.rowCount < res.rows[0].max_participants) {
        if (!res.rows.some((row) => row.user_id === options.body.user_id)) {
          const insertQuery =
            "INSERT INTO participants (event_id, user_id) VALUES ($1, $2)";
          const insertValues = [options.event_id, options.body.user_id];

          const insertRes = await client.query(insertQuery, insertValues);

          client.release();

          return {
            status: 200,
            message: "OK",
          };
        } else {
          client.release();
          return {
            status: 400,
            error: "User already joined the event",
          };
        }
      } else {
        client.release();
        return {
          status: 400,
          error: "Event is full already",
        };
      }
    } catch (error) {
      throw new ServerError({
        status: 500,
        error: "Server Error",
      });
    }
  }

  return {
    status: 400,
    message: "Invalid input",
  };
};

/**
 * @param {Object} options
 * @throws {Error}
 * @return {Promise}
 */
module.exports.getEvents = async (options) => {
  try {
    const client = await pool.connect();

    const query = `SELECT events.* FROM events, fields WHERE events.field = fields.id AND TO_CHAR(events.start_time, 'DD-MM-YYYY') = TO_CHAR(NOW(), 'DD-MM-YYYY')`;
    const res = await client.query(query);

    client.release();

    return {
      status: 200,
      data: res.rows,
    };
  } catch (error) {
    console.log(error);

    throw new ServerError({
      status: 500,
      error: "Server Error",
    });
  }
};
