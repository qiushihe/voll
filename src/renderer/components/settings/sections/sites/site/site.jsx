import { PureComponent } from "react";
import PropTypes from "prop-types";

import ListItemText from "@material-ui/core/ListItemText";
import { Edit as EditIcon } from "@material-ui/icons";

import SectionItem from "/src/renderer/components/settings/section/item";

class Site extends PureComponent {
  render() {
    const { name, url, onClick } = this.props;

    return (
      <SectionItem onClick={onClick}>
        <ListItemText primary={name} secondary={url} />
        <EditIcon color="action" />
      </SectionItem>
    );
  }
}

Site.propTypes = {
  name: PropTypes.string,
  url: PropTypes.string,
  onClick: PropTypes.func
};

Site.defaultProps = {
  name: "A Site",
  url: "",
  onClick: () => ({})
};

export default Site;
