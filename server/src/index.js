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
// database connection object
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
  // SAME AS DOING THIS: `SELECT * FROM animals WHERE name = '${name}'` but NOT secure
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
async function deleteOneAnimal(id) {
  // await db.query(
  //   "DELETE FROM animals WHERE id = $1 RETURNING *",
  //   [id],
  // );
  const result = await db.query(
    "DELETE FROM animals WHERE id = $1 RETURNING *",
    [id],
  );
  return result.rows[0];
}

// 8. addOneAnimal(name, category, can_fly, lives_in)
async function addOneAnimal(name, category, can_fly, lives_in) {
  await db.query(
    "INSERT INTO animals (name, category, can_fly, lives_in) VALUES ($1, $2, $3, $4)",
    [name, category, can_fly, lives_in],
  );
}

// 9. updateOneAnimalName(id, newName)
async function updateOneAnimalName(id, newName) {
  const result = await db.query(
    "UPDATE animals SET name = $2 WHERE id = $1 RETURNING *",
    [id, newName],
  );
  return result.rows[0];
}

// 10. updateOneAnimalCategory(id, newCategory)
async function updateOneAnimalCategory(id, newCategory) {
  const result = await db.query(
    "UPDATE animals SET category = $2 WHERE id = $1 RETURNING *",
    [id, newCategory],
  );
  return result.rows[0];
}

// 11. 🌟 BONUS CHALLENGE — addManyAnimals(animals)
// 
// DECLARING an async HELPER function (TO BE CALLED LATER FROM THE API ENDPOINT)
// FUNC name/identifier (addManyAnimals), WHO's JOB is to INSERT MANY ANIMAL RECORDS(obj) INTO the DB
// THIS HELPER FUNC IS TYPICALLY CALLED BY A POST ROUTE
async function addManyAnimals(animals) {
  // using a FOR OF LOOP to loop/ITERATE through EACH OBJ (animal) of the animals ARRAY OF OBJs
  for (const animal of animals) {
    // we are now AWAITing for the QUERY sent to the DB to finish before CONTINUING TO THE NEXT ITERATION OF THE LOOP
    // ---Without AWAIT----
    // the loop would fire off all the queries immediately.
    // ---With AWAIT----
    // the loop waits for one insert to finish before starting the next.
    // This is called sequential execution.
    await db.query(
      //.query calls the database's QUERY METHOD -- it'S jobs: send SQL STATEMENT TO PG. wait for PG. RCV the response
      // This is the SQL query string. Its where we pass in the Columns & VALUES (placeholders)
      "INSERT INTO animals (name, category, can_fly, lives_in) VALUES ($1, $2, $3, $4)",
      // we are using the spread operator to pass the values of the animal object into the query
      // REAL VALUES supplied separately. LOL

      // This is an ARRAY LITERAL
      // It contains the values that replace the placeholders.
      [animal.name, animal.category, animal.can_fly, animal.lives_in],
    );
  }
}
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

// --------------------------------------
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
// --------------------------------------
// 6. 🌟 BONUS CHALLENGE — GET /get-animals-by-category/:category
app.get("/get-animals-by-category/:category", async (req, res) => {
  const category = req.params.category;
  const animals = await getAnimalsByCategory(category);
  console.log(animals);
  res.json(animals);
});

// 7. POST /delete-one-animal/:id
app.post("/delete-one-animal/:id", async (req, res) => {
  const id = req.params.id;

  await deleteOneAnimal(id);

  res.send(`Success! Animal with ID ${id} was deleted.`);
});

// 8. POST /add-one-animal
app.post("/add-one-animal", async (req, res) => {
  // get the request body
  const { name, category, can_fly, lives_in } = req.body;
  // helper function
  await addOneAnimal(name, category, can_fly, lives_in);
  // send a response
  // res.send(), res.txt(), res.json()

  res.send(`Success! ${name} was added!`);
});

// 9. POST /update-one-animal-name
app.post("/update-one-animal-name", async (req, res) => {
  const { id, newName } = req.body;

  await updateOneAnimalName(id, newName);

  res.send(`Success! Animal ${id} was renamed to ${newName}.`);
});

// 10. POST /update-one-animal-category
app.post("/update-one-animal-category", async (req, res) => {
  const { id, newCategory } = req.body;

  await updateOneAnimalCategory(id, newCategory);

  res.send(`Success! Animal ${id} is now a ${newCategory}.`);
});

// 11. 🌟 BONUS CHALLENGE — POST /add-many-animals
app.post("/add-many-animals", async (req, res) => {
  const { animals } = req.body;

  await addManyAnimals(animals);

  res.send("Success! Animals were added!");
});
