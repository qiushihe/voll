import getOr from "lodash/fp/getOr";

export const stateChanger = (component) => (valueGetter) => (fieldName) => (evt) => {
  const fieldValue = valueGetter(evt);
  return new Promise((resolve) => {
    component.setState(() => ({ [fieldName]: fieldValue }), resolve);
  });
};

export const getCheckedOr = (defaultValue) => (evt) => getOr(defaultValue, "target.checked")(evt);
