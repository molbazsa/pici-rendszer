import React from "react";
import axios from "axios";

export default function GroupField({
  formIncorrect,
  id,
  value,
  isSearch,
  isInp,
  setValue,
  error,
  setError,
}) {
  const search = (
    <div>
      <label htmlFor="groupField">
        Cikkcsoport - Keresés: {id.slice(0, 3)}
      </label>
      <input
        type="text"
        id="groupField"
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
      />
    </div>
  );

  const input = (
    <div>
      <label htmlFor="groupField">Cikkcsoport - Új: {id.slice(0, 3)}</label>
      <input
        type="text"
        id="groupField"
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
            return "Ez a csoport már létezik.";
          return "";
        })()}
      </span>
    </div>
  );

  const display = (
    <div>
      <span className="block m-1">Cikkcsoport</span>
      <input disabled="disabled" value={value} />
    </div>
  );

  return (
    <div>
      {isSearch && search}
      {isInp && input}
      {!isSearch && !isInp && display}
    </div>
  );
}
