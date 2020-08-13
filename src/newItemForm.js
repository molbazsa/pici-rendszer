import React, { useState, useEffect } from "react";
import axios from "axios";

export default function NewItemForm() {
  const [idField, setIdField] = useState("");
  const [idFieldIsValid, setIdFieldIsValid] = useState(false);
  const [idAvailable, setIdAvailable] = useState(true);
  const [nameField, setNameField] = useState("");
  const [nameFieldIsValid, setNameFieldIsValid] = useState(false);
  const [wasSubmitted, setWasSubmitted] = useState(false);

  const changeIdField = (e) => {
    setIdField(e.target.value);
    setIdFieldIsValid(e.target.checkValidity());
  };

  const changeNameField = (e) => {
    setNameField(e.target.value);
    setNameFieldIsValid(e.target.checkValidity());
  };

  const submitNewItem = async (e) => {
    setWasSubmitted(true);
    e.preventDefault();
    if (!idAvailable) return;
    console.log("Submitting new item...");
    try {
      const result = await axios.post("http://localhost:1111/new-item", {
        id: idField,
        name: nameField,
      });
      console.log("Submitted new item");
      console.log("Result:");
      console.log(result);
      setIdField("");
      setNameField("");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (idFieldIsValid) {
      console.info("Verifying id");
      (async () => {
        const response = await axios.post(
          "http://localhost:1111/verify-item-id",
          {
            id: idField,
          }
        );
        console.log(
          `"${idField}" is ${
            response.data.available ? "available" : "unavailable"
          }`
        );
        setIdAvailable(response.data.available);
        console.info("Verifying successful");
      })();
    } else {
      setIdAvailable(true);
    }
  }, [idField, idFieldIsValid]);

  return (
    <div>
      <form onSubmit={submitNewItem}>
        <label htmlFor="idField">Cikkszám</label>
        <div>
          <input
            id="idField"
            type="text"
            required="required"
            minLength="9"
            maxLength="9"
            value={idField}
            onChange={changeIdField}
            className={
              idAvailable && (idFieldIsValid || !wasSubmitted)
                ? "inline"
                : "inline focus-invalid"
            }
          />
          {!idAvailable && (
            <span className="text-red-800">
              Az azonosító már fel lett használva!
            </span>
          )}
        </div>
        <label htmlFor="nameField">Megnevezés</label>
        <input
          id="nameField"
          type="text"
          required="required"
          value={nameField}
          onChange={changeNameField}
          className={nameFieldIsValid || !wasSubmitted ? "" : "focus-invalid"}
        />
        <input type="submit" value="Termék felvétele" />
      </form>
    </div>
  );
}
