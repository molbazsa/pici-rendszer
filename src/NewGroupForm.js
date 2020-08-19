import React, { useState, useEffect, useRef } from "react";
import IdField from "./NewGroupFormComponents/IdField.js";
import NameField from "./NewGroupFormComponents/NameField.js";
import axios from "axios";

export default function NewItemForm() {
  const [incorrect, setIncorrect] = useState(false);

  const [id, setId] = useState("");
  useEffect(() => {
    axios.get("http://localhost:1111/auto-group-id").then((result) => {
      setId(result.data.autoId);
    });
  }, []);
  const [idErr, setIdErr] = useState("no-error");

  const [name, setName] = useState("");
  const [nameErr, setNameErr] = useState("not-filled-error");

  const resetFields = () => {
    axios.get("http://localhost:1111/auto-group-id").then((result) => {
      setId(result.data.autoId);
    });
    setIdErr("no-error");
    setName("");
    setNameErr("not-filled-error");
  };

  const idRef = useRef();

  const submit = (event) => {
    event.preventDefault();
    if ([idErr, nameErr].every((err) => err === "no-error")) {
      setIncorrect(false);
      axios
        .post("http://localhost:1111/new-group", {
          id: id,
          name: name,
        })
        .then((result) => {
          console.log(result);
          resetFields();
        });
    } else {
      setIncorrect(true);
    }
  };

  return (
    <form onSubmit={submit}>
      <IdField
        idRef={idRef}
        formIncorrect={incorrect}
        value={id}
        setValue={setId}
        error={idErr}
        setError={setIdErr}
      />
      <NameField
        formIncorrect={incorrect}
        value={name}
        setValue={setName}
        error={nameErr}
        setError={setNameErr}
      />
      <input
        type="submit"
        value="Cikkcsoport hozzáadása"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      />
    </form>
  );
}
