import React from "react";

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
        onChange={(event) => {
          setValue(event.target.value);
          if (value === "") {
            setError("not-filled-error");
            return;
          }
          setError("no-error");
        }}
        className={(() => {
          if (formIncorrect && error === "not-filled-error") return "error";
          return "";
        })()}
      />
      <span className="input-error">
        {(() => {
          if (formIncorrect && error === "not-filled-error")
            return "Kötelező mező.";
          return "";
        })()}
      </span>
    </div>
  );
}
