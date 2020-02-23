
/*
Copyright © 2018 Roman Nep <neproman@gmail.com>
*/

import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import Check from '@material-ui/icons/Check';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import withStyles from '@material-ui/core/styles/withStyles';

import basicsStyle from 'material-kit-react-package/dist/assets/jss/material-kit-react/customCheckboxRadioSwitch';

const CustomCheckbox = (props) => {
  const { value, title, classes, ...rest } = props;
  return (
    <div className={`${classes.checkboxAndRadio} ${classes.checkboxAndRadioHorizontal}`}>
      <FormControlLabel
        control={
          <Checkbox
            checked={value}
            checkedIcon={<Check className={classes.checkedIcon} />}
            icon={<Check className={classes.uncheckedIcon} />}
            classes={{ checked: classes.checked }}
            {...rest}
          />
        }
        classes={{ label: classes.label }}
        label={title}
      />
    </div>
  );
};

export default withStyles(basicsStyle)(CustomCheckbox);
