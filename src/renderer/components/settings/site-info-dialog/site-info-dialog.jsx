import { PureComponent } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import TextField from "@material-ui/core/TextField";
import Switch from "@material-ui/core/Switch";
import Button from "@material-ui/core/Button";

const SpacedFormGroup = styled((props) => (
  <FormGroup {...props} row />
))`
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const FullWidthTextField = styled(TextField)`
  flex-grow: 1;
`;

class SiteInfoDialog extends PureComponent {
  render() {
    const {
      isOpen,
      onClose,
      siteName,
      siteUrl,
      siteIconUrl,
      siteSessionId,
      siteExternalUrlPatterns,
      siteInternalUrlPatterns
    } = this.props;

    return (
      <Dialog
        fullWidth={true}
        maxWidth="sm"
        open={isOpen}
        onClose={onClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          Edit Site Info
        </DialogTitle>
        <DialogContent>
          <SpacedFormGroup>
            <FullWidthTextField label="Name" defaultValue={siteName} />
          </SpacedFormGroup>
          <SpacedFormGroup>
            <FullWidthTextField label="URL" defaultValue={siteUrl} />
          </SpacedFormGroup>
          <SpacedFormGroup>
            <FullWidthTextField label="Icon URL" defaultValue={siteIconUrl} />
          </SpacedFormGroup>
          <SpacedFormGroup>
            <FullWidthTextField label="Session ID" defaultValue={siteSessionId} />
            <FormControlLabel
              control={(
                <Switch value="transient-session" color="primary" />
              )}
              label="Transient"
              labelPlacement="start"
            />
          </SpacedFormGroup>
          <SpacedFormGroup>
            <FullWidthTextField label="External URL Patterns (one on each line)" defaultValue={siteExternalUrlPatterns} multiline />
          </SpacedFormGroup>
          <SpacedFormGroup>
            <FullWidthTextField label="Internal URL Patterns (one on each line)" defaultValue={siteInternalUrlPatterns} multiline />
          </SpacedFormGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => ({})} color="secondary" disabled>
            Delete Site (non-functional)
          </Button>
          <Button onClick={onClose} color="default">
            Cancel
          </Button>
          <Button onClick={() => ({})} color="primary" disabled>
            Save (non-functional)
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

SiteInfoDialog.propTypes = {
  isOpen: PropTypes.bool,
  siteName: PropTypes.string,
  siteUrl: PropTypes.string,
  siteIconUrl: PropTypes.string,
  siteSessionId: PropTypes.string,
  siteExternalUrlPatterns: PropTypes.string,
  siteInternalUrlPatterns: PropTypes.string,
  onClose: PropTypes.func
};

SiteInfoDialog.defaultProps = {
  isOpen: false,
  siteName: "",
  siteUrl: "",
  siteIconUrl: "",
  siteSessionId: "",
  siteExternalUrlPatterns: "",
  siteInternalUrlPatterns: "",
  onClose: () => ({})
};

export default SiteInfoDialog;
