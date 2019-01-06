import { PureComponent } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import { Close as CloseIcon } from "@material-ui/icons";
import ListItemText from "@material-ui/core/ListItemText";
import Switch from "@material-ui/core/Switch";

import { OVERLAY } from "/src/renderer/helpers/z-index.helper";

import Section from "./section";
import SectionItem from "./section/item";

import SitesSection from "./sections/sites";

import SiteInfoDialog from "./site-info-dialog";

const Base = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: white;
  z-index: ${OVERLAY};
`;

const HeaderText = styled((props) => (
  <Typography {...props} variant="h6" color="inherit" />
))`
  flex-grow: 1;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  overflow: auto;
`;

const ContentInner = styled.div`
  margin: 0 auto;
  padding: 24px 0;
  width: 100%;
  max-width: 600px;
`;

class Settings extends PureComponent {
  render() {
    const { onClose } = this.props;

    return (
      <Base>
        <AppBar position="relative">
          <Toolbar>
            <HeaderText>
              Settings
            </HeaderText>
            <IconButton color="inherit" onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <ContentWrapper>
          <ContentInner>
            <SitesSection />
            <Section title="Appearance (non-functional)">
              <SectionItem>
                <ListItemText
                  primary="Expanded Dock"
                  secondary="Show sites names in addition to icons in the Dock"
                />
                <Switch />
              </SectionItem>
              <SectionItem>
                <ListItemText
                  primary="Show Unread Badge"
                  secondary="Show unread badge for sites that support/report unread counts"
                />
                <Switch />
              </SectionItem>
            </Section>
            <Section title="Remote Settings (non-functional)">
              <SectionItem>
                <ListItemText
                  primary="Settings JSON URL"
                  secondary="https://..."
                />
              </SectionItem>
              <SectionItem>
                <ListItemText
                  primary="Gist Access Token"
                  secondary="XXXXXXXX-XXXX-XXXX-..."
                />
              </SectionItem>
              <SectionItem>
                <ListItemText
                  primary="Something Else"
                  secondary="There must be something else I've forgotten ..."
                />
              </SectionItem>
            </Section>
          </ContentInner>
        </ContentWrapper>
        <SiteInfoDialog />
      </Base>
    );
  }
}

Settings.propTypes = {
  onClose: PropTypes.func
};

Settings.defaultProps = {
  onClose: () => ({})
};

export default Settings;
