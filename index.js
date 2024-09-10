import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

// POSTGRESQL SETUP
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "masterdev",
  port: "5432",
});

db.connect();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// helper functions
function capitalizeWords(str) {
  return str
    .split(" ") // Split the string into words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}
async function checkVisited() {
  const result = await db.query(`
    SELECT country_code
     FROM visited_countries`);
  let countries = [];
  result.rows.forEach((country) => {
    countries.push(country.country_code);
  });
  console.log(result.rows);
  return countries;
}

app.get("/", async (req, res) => {
  //Write your code here.
  let countries = await checkVisited();
  res.render("index.ejs", { countries: countries, total: countries.length });
});

app.post("/add", async (req, res) => {
  const input = req.body["country"];

  try {
    const result = await db.query(
      `SELECT country_code 
      FROM countries
      WHERE country_name 
      LIKE '%'||$1||'%'
      `,
      [input]
    );

    const data = result.rows[0];
    const countryCode = data.country_code;
    try {
      await db.query(
        "INSERT INTO visited_countries (country_code) VALUES ($1)",
        [countryCode]
      );
      res.redirect("/");
    } catch (err) {
      console.log(err);
      const countries = await checkVisited();
      res.render("index.ejs", {
        countries: countries,
        total: countries.length,
        error: "Country has already been added, try again.",
      });
    }
  } catch (err) {
    console.log(err);
    const countries = await checkVisited();
    res.render("index.ejs", {
      countries: countries,
      total: countries.length,
      error: "Country name does not exist, try again.",
    });
  }
});

app.delete("/remove", async (req, res) => {
  async function handleDelete() {
    const pathTag = document.getElementsByName("path");
    pathTag.addEventListener;
  }
});
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
