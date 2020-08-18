import React, { useState } from "react";
import IdField from "./NewGroupFormComponents/IdField.js";
import NameField from "./NewGroupFormComponents/NameField.js";
import axios from "axios";

export default function NewItemForm() {
  const [incorrect, setIncorrect] = useState(false);

  const [id, setId] = useState("");
  const [idErr, setIdErr] = useState("length-error");

  const [name, setName] = useState("");
  const [nameErr, setNameErr] = useState("not-filled-error");

  const resetFields = () => {
    setId("");
    setIdErr("length-error");
    setName("");
    setNameErr("not-filled-error");
  };

  const submit = (event) => {
    event.preventDefault();
    if ([idErr, nameErr].every((err) => err === "no-error")) {
      setIncorrect(false);
      axios
        .post("http://localhost:1111/new-group", {
          id: id,
          name: name,
        })
        .then((result) => console.log(result));
      resetFields();
    } else {
      setIncorrect(true);
    }
  };

  return (
    <div className="flex">
      <form onSubmit={submit} className="border m-1 flex-grow-0">
        <IdField
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
        <input type="submit" value="Cikkcsoport hozzáadása" />
      </form>
    </div>
  );
}
