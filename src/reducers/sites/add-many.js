import reduce from "lodash/fp/reduce";

import addSite from "./add-one";

export default (state = {}, { sites }) => reduce(
  (intermediateState, site) => addSite(intermediateState, { site }),
  state
)(sites);
