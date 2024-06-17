const express = require("express");
const { Pool } = require("pg");
const redis = require("redis");

const app = express();
const port = 3000;

const pool = new Pool({
  user: "postgres_user",
  host: "postgres",
  database: "postgres_db",
  password: "postgres_password",
  port: 5432,
});

const redisClient = redis.createClient({ url: "redis://redis:6379" });
redisClient.connect();

app.use(express.json());

const routes = require("./routes");
app.use("/", routes(pool, redisClient));

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
