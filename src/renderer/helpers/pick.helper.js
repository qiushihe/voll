import flow from "lodash/fp/flow";
import pick from "lodash/fp/pick";
import reduce from "lodash/fp/reduce";
import map from "lodash/fp/map";

const uncappedReduce = reduce.convert({ cap: false });

export const pickObjectWithAttributes = (objectName, objectAttributes) => {
  const pickObjectAttributes = pick(objectAttributes);
  return flow([
    pick([objectName]),
    uncappedReduce((result, value, key) => ({
      ...result,
      [key]: key === objectName
        ? pickObjectAttributes(value)
        : value
    }), {})
  ]);
};

export const pickArrayObjectWithAttributes = (arrayObjectName, arrayItemAttributes) => {
  const pickItemAttributes = pick(arrayItemAttributes);
  return flow([
    pick([arrayObjectName]),
    uncappedReduce((result, value, key) => ({
      ...result,
      [key]: key === arrayObjectName
        ? map(pickItemAttributes)(value)
        : value
    }), {})
  ]);
};
