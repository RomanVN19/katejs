
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
