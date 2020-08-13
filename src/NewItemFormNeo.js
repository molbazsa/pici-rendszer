import React, { useReducer, useEffect } from "react";
import axios from "axios";

const actions = {};
const requirements = {};
const schema = {};

actions.setFieldValue = {
  handler: (state, payload) => {
    const { field } = payload;
    const valueConstraint =
      schema[field.id].valueConstraint || ((value) => value);
    const newState = {};
    newState[field.id] = {
      ...state[field.id],
      value: valueConstraint(field.value),
    };
    return {
      ...state,
      ...newState,
    };
  },
};

actions.setFieldValidity = {
  handler: (state, payload) => {
    const { field } = payload;
    const valueConstraint =
      schema[field.id].valueConstraint || ((value) => value);
    let errorMsg;
    const valid = schema[field.id].requirements
      .map((req) => {
        const resp = req(valueConstraint(field.value));
        errorMsg = resp[1];
        return resp[0];
      })
      .every((item) => item);
    if (valid !== state[field.id].valid) {
      const newState = {};
      newState[field.id] = {
        ...state[field.id],
        valid: valid,
      };
      return {
        ...state,
        ...newState,
      };
    }
    return state;
  },
};

actions.dbSetFieldValidity = {
  handler: (state, payload) => {
    const { fieldName, valid } = payload;
    const newState = {};
    newState[fieldName] = {
      ...state[fieldName],
      dbValid: valid,
    };
    return {
      ...state,
      ...newState,
    };
  },
};

const reducer = (state, action) => {
  return action.type.handler(state, action.payload);
};

const fieldTemplate = {
  value: "",
  valid: false,
  dbValid: true,
  errorMsg: "",
};

const initialState = {
  form: { submitAttempt: false },
  idField: { ...fieldTemplate },
  nameField: { ...fieldTemplate },
};

const handlers = {
  form: {},
  fields: {},
};

requirements.length = (options) => (value) => {
  let pass;
  if (options.min === undefined) {
    pass = value.length <= options.max;
  }
  if (options.max === undefined) {
    pass = options.min <= value.length;
  }
  pass = options.min <= value.length && value.length <= options.max;
  if (pass) return [true, ""];
  return [false, "A hossz nem megfelelő"];
};

schema.idField = {
  valueConstraint: (value) => value.slice(0, 9),
  requirements: [requirements.length({ min: 9, max: 9 })],
};

schema.nameField = {
  requirements: [requirements.length({ min: 1 })],
};

styles = {};

styles.fields = (submitAttempt, valid, dbValid) => {
  if ((submitAttempt && !valid) || !dbValid) return "border-red-800";
  return "";
};

export default function NewItemFormNeo() {
  const [state, dispatch] = useReducer(reducer, initialState);

  handlers.form.submit = (event) => {
    event.preventDefault();
    console.log("form submitted");
  };

  handlers.fields.change = (event) => {
    const { target } = event;
    dispatch({
      type: actions.setFieldValue,
      payload: {
        field: target,
      },
    });
    dispatch({
      type: actions.setFieldValidity,
      payload: {
        field: target,
      },
    });
  };

  useEffect(() => {
    if (state.idField.valid) {
      console.info("Verifying id");
      (async () => {
        const response = await axios.post(
          "http://localhost:1111/verify-item-id",
          {
            id: state.idField.value,
          }
        );
        console.log(
          `"${state.idField.value}" is ${
            response.data.available ? "available" : "unavailable"
          }`
        );
        dispatch({
          type: actions.dbSetFieldValidity,
          payload: {
            fieldName: "idField",
            valid: response.data.available,
          },
        });
        console.info("Verifying successful");
      })();
    }
  }, [state.idField.value, state.idField.valid]);

  return (
    <div>
      <form onSubmit={handlers.form.submit}>
        <div>
          <label htmlFor="idField">Cikkszám</label>
          <input
            type="text"
            id="idField"
            value={state.idField.value}
            onChange={handlers.fields.change}
            className={styles.fields(
              state.form.submitAttempt,
              state.idField.valid,
              state.idField.dbValid
            )}
          />
          <span className="text-red-800">{state.idField.errorMsg}</span>
        </div>
        <div>
          <label htmlFor="nameField">Megnevezés</label>
          <input
            type="text"
            id="nameField"
            value={state.nameField.value}
            onChange={handlers.fields.change}
            className={styles.fields(
              state.nameField.valid,
              state.nameField.dbValid
            )}
          />
          <span className="text-red-800">{state.idField.errorMsg}</span>
        </div>
        <input type="submit" value="Termék felvétele" />
      </form>
    </div>
  );
}
