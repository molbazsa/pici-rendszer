import React from "react";
import NewItemForm from "./NewItemForm.js";
import NewGroupForm from "./NewGroupForm.js";

export default function App() {
  return (
    <div className="App">
      <h1 className="m-1 text-6xl">Pici - Teszt</h1>
      <h2 className="m-1 text-3xl underline">Új termék</h2>
      <NewItemForm />
      <h2 className="m-1 text-3xl underline">Új cikkcsoport</h2>
      <NewGroupForm />
    </div>
  );
}
