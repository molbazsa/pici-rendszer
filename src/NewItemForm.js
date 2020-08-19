import React, { useState } from "react";
import IdField from "./NewItemFormComponents/IdField.js";
import NameField from "./NewItemFormComponents/NameField.js";
import GroupField from "./NewItemFormComponents/GroupField.js";
import axios from "axios";

export default function NewItemForm() {
  const [incorrect, setIncorrect] = useState(false);

  const [id, setId] = useState("");
  const [idErr, setIdErr] = useState("length-error");
  const [idAutoFilled, setIdAutoFilled] = useState(false);

  const [name, setName] = useState("");
  const [nameErr, setNameErr] = useState("not-filled-error");

  const [group, setGroup] = useState("");
  const [groupSearch, setGroupSearch] = useState(true);
  const [groupInp, setGroupInp] = useState(false);
  const [groupErr, setGroupErr] = useState("no-error");

  const resetFields = () => {
    setId("");
    setIdErr("length-error");
    setIdAutoFilled(false);
    setName("");
    setNameErr("not-filled-error");
    setGroup("");
    setGroupSearch(true);
    setGroupInp(false);
    setGroupErr("no-error");
  };

  const submit = (event) => {
    event.preventDefault();
    if ([idErr, nameErr, groupErr].every((err) => err === "no-error")) {
      setIncorrect(false);
      axios
        .post("http://localhost:1111/new-item", {
          id: id,
          name: name,
          group: group,
        })
        .then((result) => console.log(result));
      resetFields();
    } else {
      setIncorrect(true);
    }
  };

  return (
    <form onSubmit={submit} className="mb-8">
      <IdField
        formIncorrect={incorrect}
        value={id}
        setValue={setId}
        error={idErr}
        setError={setIdErr}
        wasAutoFilled={idAutoFilled}
        setAutoFilled={setIdAutoFilled}
        setGroup={setGroup}
        setGroupSearch={setGroupSearch}
        setGroupInp={setGroupInp}
        setGroupError={setGroupErr}
      />
      <GroupField
        formIncorrect={incorrect}
        id={id}
        value={group}
        isSearch={groupSearch}
        isInp={groupInp}
        setValue={setGroup}
        error={groupErr}
        setError={setGroupErr}
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
        value="Termék felvétele"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      />
    </form>
  );
}
