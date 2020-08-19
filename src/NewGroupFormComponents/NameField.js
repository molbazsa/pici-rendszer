import React from "react";
import axios from "axios";

export default function NameField({
  formIncorrect,
  value,
  setValue,
  error,
  setError,
}) {
  return (
    <div>
      <label htmlFor="nameField">Megnevezés</label>
      <input
        type="text"
        id="nameField"
        value={value}
        onChange={async (event) => {
          const newValue = event.target.value;
          setValue(newValue);
          if (newValue === "") {
            setError("not-filled-error");
            return;
          }
          const available = (
            await axios.post("http://localhost:1111/verify-group-name", {
              name: newValue,
            })
          ).data.available;
          if (!available) {
            setError("name-unavailable-error");
            return;
          }
          setError("no-error");
        }}
        className={(() => {
          if (formIncorrect && error === "not-filled-error") return "error";
          if (error === "name-unavailable-error") return "error";
          return "";
        })()}
      />
      <span className="input-error">
        {(() => {
          if (formIncorrect && error === "not-filled-error")
            return "Kötelező mező.";
          if (error === "name-unavailable-error")
            return "Ilyen nevű cikkcsoport már létezik.";
          return "";
        })()}
      </span>
    </div>
  );
}
