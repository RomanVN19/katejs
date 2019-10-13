
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
import Datetime from 'react-datetime';

import moment from 'moment';
import withStyles from '@material-ui/core/styles/withStyles';

import CustomInput from 'material-kit-react-package/dist/components/CustomInput/CustomInput';
import './DateInput.css';

const styles = theme => ({
  dt: {
    '& th.rdtPrev,& th.rdtNext,& th.rdtSwitch,& .dow,& .rdtTimeToggle': {
      color: theme.palette.primary.main,
    },
    '& .rdtYear.rdtActive,& .rdtDay.rdtActive,& .rdtMonth.rdtActive': {
      backgroundColor: `${theme.palette.primary.main}!important`,
    },
    '& .rdtCounter:last-child .rdtCount': {
      color: theme.palette.primary.main,
      borderColor: theme.palette.primary.main,
    },
  },
});

const DateInput = (props) => {
  const {
    inputProps: { onBlur, onFocus, value, onChange, disabled, ...restInputProps },
    formControlProps,
    labelText,
    classes,
    dateFormat,
    timeFormat,
    ...restProps
  } = props;
  let momentDate;
  if (typeof value === 'string' && value.length === 24) {
    momentDate = moment(value, null, true);
  } else {
    momentDate = moment(value, `${dateFormat}${timeFormat && ` ${timeFormat}`}`, true);
  }
  const disabledProps = {};
  if (disabled) {
    disabledProps.onFocus = null;
    disabledProps.onClick = null;
  }
  return (
    <Datetime
      onFocus={onFocus}
      onBlur={onBlur}
      dateFormat={dateFormat}
      timeFormat={timeFormat}
      value={momentDate.isValid() ? momentDate : value}
      onChange={onChange}
      className={classes.dt}
      renderInput={dateInputProps => (
        <CustomInput
          inputProps={{
            ...dateInputProps,
            ...restInputProps,
            disabled,
            ...disabledProps,
          }}
          labelText={labelText}
          formControlProps={formControlProps}
        />
      )}
      closeOnSelect
      {...restProps}
    />
  );
};

export default withStyles(styles)(DateInput);
