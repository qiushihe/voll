import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import { activateSite } from "/src/actions/webviews.action";
import { id, name } from "/src/selectors/site.selector";

import Site from "./site";

export default connect(
  createStructuredSelector({
    id,
    name
  }),
  (dispatch) => ({
    activateSite: ({ siteId }) => {
      dispatch(activateSite({ siteId }))
    }
  }),
  (stateProps, dispatchProps, ownProps) => ({
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    activateSite: () => dispatchProps.activateSite({ siteId: stateProps.id })
  })
)(Site);
