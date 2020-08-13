import React, { useState } from "react";

export default function NewItemFormNeo2() {
  const useFieldState = () => {
    const [value, setValue] = useState("");
    const [valid, setValid] = useState(false);
    const [dbValid, setDbValid] = useState(true);
    const [errorMsg, setErrorMsg] = useState("");
    return {
      get: {
        value: value,
        valid: valid,
        dbValid: dbValid,
        errorMsg: errorMsg,
      },
      set: {
        value: setValue,
        valid: setValid,
        dbValid: setDbValid,
        errorMsg: setErrorMsg,
      },
    };
  };

  const [submErr, setSubmErr] = useState(false);
  const idField = useFieldState();
  const nameField = useFieldState();

  const handleFieldChange = (state) => (event) => {
    state.set.value(event.target.value);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    setSubmErr(true);
  };

  const fieldClass = (state) => "";

  return (
    <div>
      <form onSubmit={handleFormSubmit}>
        <div>
          <label htmlFor="idField">Cikkszám</label>
          <input
            id="idField"
            value={idField.get.value}
            onChange={handleFieldChange(idField)}
            className={fieldClass(idField)}
          />
          <span>{idField.get.errorMsg}</span>
        </div>
        <div>
          <label htmlFor="nameField">Megnevezés</label>
          <input
            id="nameField"
            value={nameField.get.value}
            onChange={handleFieldChange(nameField)}
            className={fieldClass(nameField)}
          />
          <span>{nameField.get.errorMsg}</span>
        </div>
        <input type="submit" value="Termék felvétele" />
      </form>
    </div>
  );
}
