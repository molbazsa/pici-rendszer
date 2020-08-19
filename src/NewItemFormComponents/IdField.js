import React from "react";
import axios from "axios";

export default function IdField({
  formIncorrect,
  value,
  setValue,
  error,
  setError,
  wasAutoFilled,
  setAutoFilled,
  setGroup,
  setGroupSearch,
  setGroupInp,
  setGroupError,
}) {
  return (
    <div>
      <label htmlFor="idField">Cikkszám</label>
      <input
        type="text"
        id="idField"
        value={value}
        onChange={async (event) => {
          let newValue = event.target.value.match(/^[0-9]*/g)[0].slice(0, 9);
          if (newValue === "000") {
            newValue = "00";
          }
          if (newValue.slice(3, 9) === "000000") {
            newValue = newValue.slice(0, 8);
          }
          if (newValue.length < 3) {
            setAutoFilled(false);
            setGroupSearch(true);
          } else {
            setGroupSearch(false);
          }
          if (newValue.length >= 3) {
            const groupId = newValue.slice(0, 3);
            const groupAvailable = (
              await axios.post("http://localhost:1111/verify-group-id", {
                id: groupId,
              })
            ).data.available;
            if (groupAvailable) {
              if (!wasAutoFilled) {
                setAutoFilled(true);
                newValue += "000001";
              }
              setGroup("");
              setGroupInp(true);
              setGroupError("not-filled-error");
            } else {
              setGroup(
                (
                  await axios.post("http://localhost:1111/get-group-name", {
                    id: groupId,
                  })
                ).data.name
              );
              setGroupInp(false);
              if (!wasAutoFilled) {
                newValue = (
                  await axios.post("http://localhost:1111/auto-item-id", {
                    groupId: groupId,
                  })
                ).data.autoId;
              }
              setAutoFilled(true);
            }
          } else {
            setGroup("");
            setGroupInp(false);
          }
          setValue(newValue);
          if (newValue.length !== 9) {
            setError("length-error");
            return;
          }
          const available = (
            await axios.post("http://localhost:1111/verify-item-id", {
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
