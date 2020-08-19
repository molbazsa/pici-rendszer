import React from "react";
import axios from "axios";

export default function GroupField({
  formIncorrect,
  id,
  idRef,
  value,
  isSearch,
  isInp,
  setValue,
  error,
  setError,
  dropdown,
  setDropdown,
}) {
  const updateDropdown = (searchTerm) => {
    axios
      .post("http://localhost:1111/group-name-search", {
        searchTerm: searchTerm,
      })
      .then((result) => {
        if (result.data.documents.length === 0) {
          setDropdown("Nincs találat.");
          return;
        }
        setDropdown(
          result.data.documents.map((doc) => (
            <p
              key={doc._id}
              className="hover:bg-gray-400 p-1 cursor-default"
              onClick={() => {
                const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
                  window.HTMLInputElement.prototype,
                  "value"
                ).set;
                nativeInputValueSetter.call(idRef.current, doc._id);
                idRef.current.dispatchEvent(
                  new Event("input", { bubbles: true })
                );
              }}
            >
              {doc._id} {doc.name}
            </p>
          ))
        );
      });
  };

  const search = (
    <div className="dropdown">
      <label htmlFor="groupField">Cikkcsoport - Keresés:</label>
      <input
        type="text"
        id="groupField"
        value={value}
        onChange={async (event) => {
          const newValue = event.target.value;
          setValue(newValue);
          updateDropdown(newValue);
        }}
        onFocus={(event) => updateDropdown(event.target.value)}
      />
      <div className="dropdown-content">{dropdown}</div>
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
            return "Ilyen nevű cikkcsoport már létezik.";
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
