import { PureComponent } from "react";
import PropTypes from "prop-types";
import isFunction from "lodash/fp/isFunction";

import ListItem from "@material-ui/core/ListItem";

class Item extends PureComponent {
  render() {
    const { onClick, children } = this.props;

    return (
      <ListItem onClick={onClick} button={isFunction(onClick)}>
        {children}
      </ListItem>
    );
  }
}

Item.propTypes = {
  onClick: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node)
  ])
};

Item.defaultProps = {
  // Set default onClick to null instead of a blank function as usual.
  // This way we can detect if the component should be "clickable" or not
  // and update the `button` prop for `ListItem` accordingly.
  onClick: null,

  children: null
};

export default Item;
