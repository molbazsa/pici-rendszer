import React from "react";
import axios from "axios";

export default function IdField({
  formIncorrect,
  value,
  setValue,
  error,
  setError,
}) {
  return (
    <div>
      <label htmlFor="idField">Azonosító</label>
      <input
        type="text"
        id="idField"
        value={value}
        onChange={async (event) => {
          let newValue = event.target.value.match(/^[0-9]*/g)[0].slice(0, 3);
          if (newValue === "000") {
            newValue = "00";
          }
          setValue(newValue);
          if (newValue.length !== 3) {
            setError("length-error");
            return;
          }
          const available = (
            await axios.post("http://localhost:1111/verify-group-id", {
              id: newValue,
            })
          ).data.available;
          if (!available) {
            setError("id-unavailable-error");
            return;
          }
          setError("no-error");
        }}
        className={(() => {
          if (formIncorrect && error === "length-error") return "error";
          if (error === "id-unavailable-error") return "error";
          return "";
        })()}
      />
      <span>{`(${value.length}/3)`}</span>
      <span className="input-error m-1">
        {(() => {
          if (formIncorrect && error === "length-error")
            return "Nincs meg a 3 számjegy.";
          if (error === "id-unavailable-error")
            return "Ez az azonosító már foglalt.";
          return "";
        })()}
      </span>
    </div>
  );
}
