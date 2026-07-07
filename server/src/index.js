// ---------------------------------
// Boilerplate Code to Set Up Server
// ---------------------------------
import express from "express";
// pg - STANDS FOR - PostgreSQL client - connection to my database
import pg from "pg";

// import configuration file
import config from "./config.js";

// create a new instance of the pg.Pool class
// connect to our DB (PostgreSQL) using the connection string from the config file
const db = new pg.Pool({
  connectionString: config.databaseUrl,
  ssl: true, // enable SSL for secure connection
});

// create a new instance of the express application
const app = express();

// app.use(cors());
app.use(express.json());

// set the port number for the server to listen on PORT #
const port = 3000;

// start the server and listen for incoming requests WHEN WE OPEN FILE
app.listen(port, () => {
  console.log(`Server is running HOT on http://localhost:${port}`);
});
// ---------------------------------
// Helper Functions
// ---------------------------------

// 1. getAllAnimals()
async function getAllAnimals() {
  // query the DB
  const result = await db.query("SELECT * FROM animals");
  // return correct data
  // return the rows from the result

  // console.log("RESULT >>>", result);
  //   console.log("RESULT >>>", result.rows);

  return result.rows;
}

// 2. getOneAnimalByName(name)
async function getOneAnimalByName(name) {
  // query the DB
  // store in a VAR called result
  // SELECT * FROM animals WHERE name = 'Blue Whale'
  const result = await db.query("SELECT * FROM animals WHERE name = $1", [
    name,
  ]);
  // const result = await db.query("SELECT * FROM animals WHERE name = $1 or $2", [name, name2]);
  // SAME AS DOING THIS: `SELECT * FROM animals WHERE name = '${name}'`
  // RETURN the RIGHT THING (correct data)
  return result.rows[0];
}
// console.log("RESULT >>>", result.rows[0]);
// 3. getOneAnimalById(id)
async function getOneAnimalById(id) {
  const result = await db.query("SELECT * FROM animals WHERE id = $1", [id]);
  return result.rows[0];
}

// 4. getNewestAnimal()
async function getNewestAnimal() {
  const result = await db.query(
    "SELECT * FROM animals ORDER BY id DESC LIMIT 1",
  );
  return result.rows[0];
}

// 5. 🌟 BONUS CHALLENGE — getAllMammals()
async function getAllMammals() {
  const result = await db.query(
    "SELECT * FROM animals WHERE category = 'mammal'",
  );
  return result.rows;
}

// 6. 🌟 BONUS CHALLENGE — getAnimalsByCategory(category)
async function getAnimalsByCategory(category) {
  const result = await db.query("SELECT * FROM animals WHERE category = $1", [
    category,
  ]);
  return result.rows;
}

// //here is another asynchronous function that runs in the API endpoints WHERE it =called.
// async function getAnimalsByCategory(category) {
// //THEN, we want the result from the SQL QUERY into the DB *
//   const result = await db.query("SELECT * FROM animals WHERE category = $1", [category]);
//   return result.rows;
// }

// 7. deleteOneAnimal(id)

// 8. addOneAnimal(name, category, can_fly, lives_in)

// 9. updateOneAnimalName(id, newName)

// 10. updateOneAnimalCategory(id, newCategory)

// 11. 🌟 BONUS CHALLENGE — addManyAnimals(animals)

// ---------------------------------
// API Endpoints
// ---------------------------------

// 1. GET /get-all-animals
app.get("/get-all-animals", async (req, res) => {
  //   console.log("✅ /get-all-animals >>> ENDPOINT was hit");
  // call HELPER FUNC to get all animals from DB
  // await getAllAnimals();
  const animals = await getAllAnimals();
  console.log(animals);
  // get result from DB and send it back to the client/FRONTEND
  res.json(animals);
});

// 2. GET /get-one-animal-by-name/:name
app.get("/get-one-animal-by-name/:name", async (req, res) => {
  const name = req.params.name;
  const animal = await getOneAnimalByName(name);
  console.log(animal);
  // SEND IT BACK TO THE CLIENT!!
  res.json(animal);
});

// 3. GET /get-one-animal-by-id/:id
app.get("/get-one-animal-by-id/:id", async (req, res) => {
  const id = req.params.id;
  const animal = await getOneAnimalById(id);
  console.log(animal);
  res.json(animal);
});

// 4. GET /get-newest-animal
app.get("/get-newest-animal", async (req, res) => {
  const animal = await getNewestAnimal();
  console.log(animal);
  res.json(animal);
});

// 5. 🌟 BONUS CHALLENGE — GET /get-all-mammals
app.get("/get-all-mammals", async (req, res) => {
  const mammals = await getAllMammals();
  console.log(mammals);
  res.json(mammals);
});

// 6. 🌟 BONUS CHALLENGE — GET /get-animals-by-category/:category
app.get("/get-animals-by-category/:category", async (req, res) => {
  const category = req.params.category;
  const animals = await getAnimalsByCategory(category);
  console.log(animals);
  res.json(animals);
});

//we are accessing app & using the get method from node or express
//we are then calling the correct endpoint & simultaneously sending an synchronous req & res fetch call.
//and using an arrow function we are calling this function to get back data from the DB
//inside the arrow function, we are declaring 2 variables for STORING the returned info.

// app.get("/get-animals-by-category/:category", async (req, res) => {
// //1st VAR is using dot notation to access the request via the parameters & accessing the category key=value pair
//   const category = req.params.category;
// //2nd VAR is awaiting the helper function to grab the category column
//   const animals = await getAnimalsByCategory(category);
// //THEN we console log to ensure correct data is being pulled.
//   console.log(animals);
// //THEN we RETURN THE correct JSON data from animlas data
//   res.json(animals);
// });

// 7. POST /delete-one-animal/:id

// 8. POST /add-one-animal

// 9. POST /update-one-animal-name

// 10. POST /update-one-animal-category

// 11. 🌟 BONUS CHALLENGE — POST /add-many-animals

//we are accessing app & using the get method from node or express
//we are then calling the correct endpoint & simultaneously sending an synchronous req & res fetch call.
//and using an arrow function we are calling this function to get back data from the DB
//inside the arrow function, we are declaring 2 variables for STORING the returned info.
