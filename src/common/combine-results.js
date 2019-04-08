import first from "lodash/fp/first";
import map from "lodash/fp/map";
import isFunction from "lodash/fp/isFunction";

const promisedResult = (fn, args = []) => {
  if (isFunction(fn)) {
    const result = fn(...args);
    if (isFunction(result.then)) {
      return result;
    } else {
      return Promise.resolve(result);
    }
  } else {
    return Promise.resolve(fn);
  }
};

export default (...fns) => (...args) => {
  const gatherers = [...fns];
  // The `splice` call will remove the last element from the `gatherers` array.
  const resolver = first(gatherers.splice(-1, 1)) || (() => null);

  return Promise.all(
    map((gatherer) => promisedResult(gatherer, args))(gatherers)
  ).then((promisedResults) => (
    promisedResult(resolver, promisedResults)
  ));
};
