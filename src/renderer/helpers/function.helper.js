import map from "lodash/fp/map";

// It's not really "parallel" in that the callbacks don't technically get called at the same time but rather get called
// one after another by `map`.
// The "parallel" here simple means that each callback doesn't care about the result of any previous/other callbacks.
export const parallelCallbacks = (...callbacks) => (...args) => {
  map((callback) => callback(...args))(callbacks);
};
