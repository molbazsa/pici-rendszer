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
      <label htmlFor="idField">Cikkszám</label>
      <input
        type="text"
        id="idField"
        value={value}
        onChange={async (event) => {
          const value = event.target.value;
          setValue(value.match(/^[0-9]*/g)[0].slice(0, 9));
          if (value.length !== 9) {
            setError("length-error");
            return;
          }
          const available = (
            await axios.post("http://localhost:1111/verify-item-id", {
              id: value,
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
      <span>{`(${value.length}/9)`}</span>
      <span className="input-error m-1">
        {(() => {
          if (formIncorrect && error === "length-error")
            return "Nincs meg a 9 számjegy.";
          if (error === "id-unavailable-error")
            return "Ez a cikkszám már foglalt.";
          return "";
        })()}
      </span>
    </div>
  );
}
