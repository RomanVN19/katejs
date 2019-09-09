
/*
Copyright © 2018 Roman Nep <neproman@gmail.com>

This file is part of kate-form-material-kit-react library.

Library kate-form-material-kit-react is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Library kate-form-material-kit-react is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with Library kate-form-material-kit-react.
If not, see <https://www.gnu.org/licenses/>.
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
