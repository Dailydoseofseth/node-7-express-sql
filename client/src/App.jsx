// ------------------
// IMPORT STATEMENTS
// ------------------

import { useState, useEffect } from "react";
import "./App.css";

// ------------------
// FUNCTION DECLARATION
// ------------------

function App() {
  // ------------------
  // STATE VARIABLES
  // ------------------

  // variable & setter FUNC. initial state set to NULL
  const [animals, setAnimals] = useState(null);

  // ------------------
  // HELPER FUNCTIONS
  // ------------------

  const getAllAnimals = async () => {
    // we fetch the endpoints we made that gathers the NEON DB Pool
    const response = await fetch("/api/get-all-animals");
    // await for response from API CALL that is accessing DB & retruning with JS Obj to be STORED into DATA VAR
    const data = await response.json();
    console.log(data);
    // CALL() the SETTER FUNC with DATA passed in as NEW VALUE
    setAnimals(data);
  };

  // DELETE ONE ANIMAL (re-home)
  const deleteOneAnimal = async (id) => {
    // send POST request to delete the animal
    const response = await fetch(`api/delete-one-animal/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    // fetch all animals again
    getAllAnimals();
  };

  // ------------------
  // EFFECTS
  // ------------------

  useEffect(() => {
    getAllAnimals();
  }, []);

  // ------------------
  // RENDERING JSX TO THE SCREEN
  // ------------------

  return (
    <>
      <h1>🐾 Full-Stack Animals App 🐾</h1>
      <div className="card">
        <h2>All Animals</h2>
        <div className="animals">
          {animals?.map((animal) => (
            // basically the ANIMAL CARD (can use CSS to TARGET IT for style etc)
            <div className="animal" key={animal.id}>
              <h2>{animal.name}</h2>
              <p>Id: {animal.id}</p>
              <p>Category: {animal.category}</p>
              <p>Lives in: {animal.lives_in}</p>
              <p>Can fly: {animal.can_fly ? "True ✅" : "False ❌"}</p>
              {/* ADD BTN to delete ONE ANIMAL. ADD FUNCTION ABOVE */}
              <button onClick={() => deleteOneAnimal(animal.id)}>
                Re-Home
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// ------------------
// EXPORT STATEMENT
// ------------------

export default App;
