
/*
Copyright © 2018 Roman Nep <neproman@gmail.com>
*/

import React from 'react';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import withStyles from '@material-ui/core/styles/withStyles';

import basicsStyle from 'material-kit-react-package/dist/assets/jss/material-kit-react/views/componentsSections/basicsStyle';

const whiteStyle = {
  whiteStyle: {
    color: '#fff',
  },
};

const allStyles = theme => ({ ...basicsStyle(theme), ...whiteStyle });

const CustomSwitch = (props) => {
  const { value, title, classes, panelStyle, ...rest } = props;
  return (
    <FormControlLabel
      control={
        <Switch
          checked={value}
          value="switch"
          classes={{
            switchBase: classes.switchBase,
            checked: classes.switchChecked,
            icon: classes.switchIcon,
            iconChecked: classes.switchIconChecked,
            bar: classes.switchBar,
          }}
          {...rest}
        />
      }
      label={title}
      classes={{ label: panelStyle ? classes.whiteStyle : undefined }}
    />
  );
};

export default withStyles(allStyles)(CustomSwitch);
