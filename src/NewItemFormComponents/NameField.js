import React from "react";

export default function IdField({ formState, state }) {
  const inputClassName = () => {
    if (formState.get.submErr && state.get.errorMsg !== "") {
      return "error";
    }
    return "";
  };

  const evaluate = (value) => {
    if (value.length < 1) {
      return "A megnevezést kötelező megadni.";
    }
    return "";
  };

  const inputOnChange = (event) => {
    const value = event.target.value;
    state.set.value(value);
    const errorMsg = evaluate(value);
    state.set.errorMsg(errorMsg);
  };

  return (
    <div>
      <label htmlFor="idField">Megnevezés</label>
      <input
        type="text"
        id="idField"
        value={state.get.value}
        className={inputClassName()}
        onChange={inputOnChange}
      />
      <span className="input-error">
        {formState.get.submErr && state.get.errorMsg}
      </span>
    </div>
  );
}
