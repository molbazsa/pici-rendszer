import React, { useState } from "react";
import IdField from "./NewItemFormComponents/IdField.js";
import NameField from "./NewItemFormComponents/NameField.js";
import axios from "axios";

export default function NewItemForm() {
  const useForm = () => {
    const [submErr, setSubmError] = useState(false);
    return {
      get: {
        submErr: submErr,
      },
      set: {
        submErr: setSubmError,
      },
    };
  };
  const form = useForm();

  const useIdField = () => {
    const [value, setValue] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [errorBefSubm, setErrorBefSubm] = useState(false);
    return {
      get: {
        value: value,
        errorMsg: errorMsg,
        errorBefSubm: errorBefSubm,
      },
      set: {
        value: setValue,
        errorMsg: setErrorMsg,
        errorBefSubm: setErrorBefSubm,
      },
    };
  };
  const idField = useIdField();

  const useNameField = () => {
    const [value, setValue] = useState("");
    const [errorMsg, setErrorMsg] = useState("A megnevezést kötelező megadni.");
    return {
      get: {
        value: value,
        errorMsg: errorMsg,
      },
      set: {
        value: setValue,
        errorMsg: setErrorMsg,
      },
    };
  };
  const nameField = useNameField();

  const formOnSubmit = (event) => {
    event.preventDefault();
    if (idField.get.errorMsg === "" && nameField.get.errorMsg === "") {
      form.set.submErr(false);
      (async () => {
        console.log("Submitting new item...");
        try {
          const result = await axios.post("http://localhost:1111/new-item", {
            id: idField.get.value,
            name: nameField.get.value,
          });
          console.log("Submitted new item");
          console.log("Result:");
          console.log(result);
          idField.set.value("");
          nameField.set.value("");
        } catch (error) {
          console.error(error);
        }
      })();
    } else {
      form.set.submErr(true);
    }
  };

  return (
    <div>
      <form onSubmit={formOnSubmit}>
        <IdField formState={form} state={idField} />
        <NameField formState={form} state={nameField} />
        <input type="submit" value="Termék felvétele" />
      </form>
    </div>
  );
}
