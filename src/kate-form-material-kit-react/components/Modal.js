
/*
Copyright © 2018 Roman Nep <neproman@gmail.com>
*/

import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Slide from '@material-ui/core/Slide';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Close from '@material-ui/icons/Close';

import basicsStyle from 'material-kit-react-package/dist/assets/jss/material-kit-react/views/componentsSections/javascriptStyles';

const Transition = props => (<Slide direction="down" {...props} />);

const dialogStyles = {
  ...basicsStyle,
  modalNoScroll: {
    ...basicsStyle.modal,
    overflowY: 'unset',
  },
  modalBodyNoScroll: {
    ...basicsStyle.modalBody,
    overflowY: 'unset',
  },
  center: {
    zIndex: 10,
  },
};

const CustomDialog = (props) => {
  const { actions, content, open, handleClose, title, classes, fullWidth, maxWidth, noScroll } = props;
  return (
    <Dialog
      classes={{
        root: classes.center,
        paper: noScroll ? classes.modalNoScroll : classes.modal,
      }}
      open={open}
      TransitionComponent={Transition}
      keepMounted
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      onClose={handleClose}
      aria-labelledby="classic-modal-slide-title"
      aria-describedby="classic-modal-slide-description"
    >
      {
        title !== undefined && (
          <DialogTitle
            id="classic-modal-slide-title"
            disableTypography
            className={classes.modalHeader}
          >
            <IconButton
              className={classes.modalCloseButton}
              key="close"
              aria-label="Close"
              color="inherit"
              onClick={handleClose}
            >
              <Close className={classes.modalClose} />
            </IconButton>
            {
              title && (
                <h4 className={classes.modalTitle}>{title}</h4>
              )
            }
          </DialogTitle>
        )
      }
      {
        open && content && (
          <DialogContent
            id="classic-modal-slide-description"
            className={noScroll ? classes.modalBodyNoScroll : classes.modalBody}
          >
            {content}
          </DialogContent>
        )
      }
      {
        actions && (
          <DialogActions className={classes.modalFooter}>
            {actions}
          </DialogActions>
        )
      }
    </Dialog>
  );
};

export default withStyles(dialogStyles)(CustomDialog);
