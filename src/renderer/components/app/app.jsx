import { PureComponent } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import get from "lodash/fp/get";

import { withTheme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";

import { CONTENT, ASIDE, BLOCKING_OVERLAY } from "/renderer/helpers/z-index.helper";
import Dock from "/renderer/components/dock";
import Webviews from "/renderer/components/webviews";
import Settings from "/renderer/components/settings";

const Base = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  flex: 1 1 auto;
  width: 100%;
  height: 100%;
`;

const StyledDrawer = styled((props) => (
  <Drawer classes={{ paper: "paper" }} {...props} />
))`
  position: relative;
  display: flex;
  flex-shrink: 0;
  width: ${get("width")}px;
  z-index: ${CONTENT};
  
  & .paper {
    width: ${get("width")}px;
    border: none;
  }
`;

const MainContent = styled.main`
  position: relative;
  display: flex;
  flex-grow: 1;
  width: 100%;
  height: 100%;
  background-color: ${get("theme.palette.background.default")};
  z-index: ${ASIDE};
`;

const LoadingBackdrop = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: white;
  font-size: 24px;
  letter-spacing: 10px;
  z-index: ${BLOCKING_OVERLAY};
`;

const DrawerWidth = {
  expanded: 240,
  collapsed: 60
};

class App extends PureComponent {
  componentDidMount() {
    this.props.onMount();
  }

  render() {
    const { theme, isAppReady, isDockExpanded, isSettingsVisible } = this.props;

    return (
      <Base>
        <CssBaseline />
        <StyledDrawer
          variant="permanent"
          anchor="left"
          open={isDockExpanded}
          width={(
            isDockExpanded
              ? DrawerWidth.expanded
              : DrawerWidth.collapsed
          )}
        >
          <Dock />
        </StyledDrawer>
        <MainContent theme={theme}>
          <Webviews />
        </MainContent>
        {!isAppReady && (
          <LoadingBackdrop>
            ... Loading ...
          </LoadingBackdrop>
        )}
        {isSettingsVisible && (
          <Settings />
        )}
      </Base>
    );
  }
}

App.propTypes = {
  theme: PropTypes.object,
  isAppReady: PropTypes.bool,
  isDockExpanded: PropTypes.bool,
  isSettingsVisible: PropTypes.bool,
  onMount: PropTypes.func
};

App.defaultProps = {
  theme: {},
  isAppReady: false,
  isDockExpanded: false,
  isSettingsVisible: false,
  onMount: (() => {})
};

export default withTheme()(App);
