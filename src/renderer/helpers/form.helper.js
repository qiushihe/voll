import getOr from "lodash/fp/getOr";
import map from "lodash/fp/map";

export const multipleCallbacks = (...callbacks) => (...args) => {
  map((callback) => callback(...args))(callbacks);
};

export const stateChanger = (component) => (valueGetter) => (fieldName) => (evt) => {
  const fieldValue = valueGetter(evt);
  component.setState(() => ({ [fieldName]: fieldValue }));
};

export const getCheckedOr = (defaultValue) => (evt) => getOr(defaultValue, "target.checked")(evt);
