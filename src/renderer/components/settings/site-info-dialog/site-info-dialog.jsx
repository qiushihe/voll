import { PureComponent } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Formik } from 'formik';

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
  constructor(...args) {
    super(...args);

    this.renderForm = this.renderForm.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }

  renderForm({
    values: {
      name,
      url,
      iconSrc,
      sessionId,
      transientSession,
      externalUrlPatterns,
      internalUrlPatterns,
      preloadCode
    },
    handleChange,
    handleSubmit
  }) {
    const { isNew, onClose } = this.props;

    return (
      <form onSubmit={handleSubmit}>
        <DialogTitle id="form-dialog-title">
          {isNew ? "Add Site" : "Edit Site Info"}
        </DialogTitle>
        <DialogContent>
          <SpacedFormGroup>
            <FullWidthTextField
              label="Name"
              name="name"
              value={name}
              onChange={handleChange}
            />
          </SpacedFormGroup>
          <SpacedFormGroup>
            <FullWidthTextField
              label="URL"
              name="url"
              value={url}
              onChange={handleChange}
            />
          </SpacedFormGroup>
          <SpacedFormGroup>
            <FullWidthTextField
              label="Icon URL"
              name="iconSrc"
              value={iconSrc}
              onChange={handleChange}
            />
          </SpacedFormGroup>
          <SpacedFormGroup>
            <FullWidthTextField
              label="Session ID"
              name="sessionId"
              value={sessionId}
              onChange={handleChange}
            />
            <FormControlLabel
              control={(
                <Switch
                  color="primary"
                  name="transientSession"
                  value={transientSession}
                  onChange={handleChange}
                />
              )}
              label="Transient"
              labelPlacement="start"
            />
          </SpacedFormGroup>
          <SpacedFormGroup>
            <FullWidthTextField
              label="External URL Patterns (one on each line)"
              name="externalUrlPatterns"
              value={externalUrlPatterns}
              onChange={handleChange}
              multiline
            />
          </SpacedFormGroup>
          <SpacedFormGroup>
            <FullWidthTextField
              label="Internal URL Patterns (one on each line)"
              name="internalUrlPatterns"
              value={internalUrlPatterns}
              onChange={handleChange}
              multiline
            />
          </SpacedFormGroup>
          <SpacedFormGroup>
            <FullWidthTextField
              label="Preload Code"
              name="preloadCode"
              value={preloadCode}
              onChange={handleChange}
              multiline
            />
          </SpacedFormGroup>
        </DialogContent>
        <DialogActions>
          {!isNew && (
            <Button onClick={() => ({})} color="secondary" disabled>
              Delete Site (non-functional)
            </Button>
          )}
          <Button onClick={onClose} color="default">
            Cancel
          </Button>
          <Button type="submit" color="primary">
            Save
          </Button>
        </DialogActions>
      </form>
    );
  }

  submitForm(values, { setSubmitting }) {
    const { onSubmit, onClose } = this.props;

    onSubmit({
      site: {
        ...values,
        internalUrlPatterns: `${values.internalUrlPatterns}`.trim().split("\n"),
        externalUrlPatterns: `${values.externalUrlPatterns}`.trim().split("\n")
      },
      onSuccess: () => {
        setSubmitting(false);
        onClose();
      },
      onError: () => {
        setSubmitting(false);
      }
    });
  }

  render() {
    const {
      isOpen,
      siteName,
      siteUrl,
      siteIconUrl,
      siteSessionId,
      siteTransientSession,
      siteExternalUrlPatterns,
      siteInternalUrlPatterns,
      sitePreloadCode,
      onClose
    } = this.props;

    return (
      <Dialog
        fullWidth={true}
        maxWidth="sm"
        open={isOpen}
        onClose={onClose}
        aria-labelledby="form-dialog-title"
      >
        <Formik
          initialValues={{
            name: siteName,
            url: siteUrl,
            iconSrc: siteIconUrl,
            sessionId: siteSessionId,
            transientSession: siteTransientSession,
            externalUrlPatterns: siteExternalUrlPatterns,
            internalUrlPatterns: siteInternalUrlPatterns,
            preloadCode: sitePreloadCode
          }}
          render={this.renderForm}
          onSubmit={this.submitForm}
        />
      </Dialog>
    );
  }
}

SiteInfoDialog.propTypes = {
  isOpen: PropTypes.bool,
  isNew: PropTypes.bool,
  siteName: PropTypes.string,
  siteUrl: PropTypes.string,
  siteIconUrl: PropTypes.string,
  siteSessionId: PropTypes.string,
  siteTransientSession: PropTypes.bool,
  siteExternalUrlPatterns: PropTypes.string,
  siteInternalUrlPatterns: PropTypes.string,
  sitePreloadCode: PropTypes.string,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func
};

SiteInfoDialog.defaultProps = {
  isOpen: false,
  isNew: false,
  siteName: "",
  siteUrl: "",
  siteIconUrl: "",
  siteSessionId: "",
  siteTransientSession: false,
  siteExternalUrlPatterns: "",
  siteInternalUrlPatterns: "",
  sitePreloadCode: "",
  onClose: () => ({}),
  onSubmit: () => ({})
};

export default SiteInfoDialog;
