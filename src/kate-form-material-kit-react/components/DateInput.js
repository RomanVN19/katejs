
/*
Copyright © 2018 Roman Nep <neproman@gmail.com>
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
