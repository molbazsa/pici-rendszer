import React from "react";
import axios from "axios";

const LENGTHOFFIELD = 9;

export default function IdField({ formState, state }) {
  const inputClassName = () => {
    if (formState.get.submErr && state.get.errorMsg !== "") {
      return "error";
    }
    if (state.get.errorBefSubm) {
      return "error";
    }
    return "";
  };

  const evaluate = async (value) => {
    state.set.errorBefSubm(false);

    if (value.length !== LENGTHOFFIELD) {
      return `Egy cikkszám ${LENGTHOFFIELD} számjegyből áll.`;
    }
    console.info("Verifying id");
    const response = await axios.post("http://localhost:1111/verify-item-id", {
      id: value,
    });
    console.info(
      `"${value}" is ${response.data.available ? "available" : "unavailable"}`
    );
    if (!response.data.available) {
      state.set.errorBefSubm(true);
      console.info("Verifying successful");
      return "Ez a cikkszám már foglalt.";
    }
    console.info("Verifying successful");
    return "";
  };

  const inputOnChange = (event) => {
    (async () => {
      const value = event.target.value.match(/^[0-9]*/g)[0].slice(0, 9);
      state.set.value(value);
      const errorMsg = await evaluate(value);
      state.set.errorMsg(errorMsg);
    })();
  };

  const spanShouldDisplay = () => {
    if (formState.get.submErr) return true;
    if (state.get.errorBefSubm) return true;
    return false;
  };

  return (
    <div>
      <label htmlFor="idField">Cikkszám</label>
      <input
        type="text"
        id="idField"
        value={state.get.value}
        className={inputClassName()}
        onChange={inputOnChange}
      />
      <span>{`(${state.get.value.length}/${LENGTHOFFIELD})`}</span>
      <span className="input-error m-1">
        {spanShouldDisplay() && state.get.errorMsg}
      </span>
    </div>
  );
}
