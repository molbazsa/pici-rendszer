import React, { useState } from "react";
import axios from "axios";

export default function NewItemForm() {
  const [idField, setIdField] = useState("");
  const [nameField, setNameField] = useState("");

  const changeIdField = (e) => {
    setIdField(e.target.value);
  };

  const changeNameField = (e) => {
    setNameField(e.target.value);
  };

  const submitNewItem = async (e) => {
    e.preventDefault();
    console.log("Submitting new item...");
    try {
      const result = await axios.post("http://localhost:1111/new-item", {
        id: idField,
        name: nameField,
      });
      console.log("Submitted new item");
      console.log("Result:");
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <form onSubmit={submitNewItem}>
        <input
          type="text"
          placeholder="Enter id"
          value={idField}
          onChange={changeIdField}
        />
        <input
          type="text"
          placeholder="Enter name"
          value={nameField}
          onChange={changeNameField}
        />
        <input type="submit" value="Add new item" />
      </form>
    </div>
  );
}
