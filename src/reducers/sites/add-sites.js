import reduce from "lodash/fp/reduce";

import addSite from "./add-site";

export default (state = {}, { sites }) => reduce(
  (intermediateState, site) => addSite(intermediateState, { site }),
  state
)(sites);
