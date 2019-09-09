
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

import React, { Component, Fragment } from 'react';

import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import IconButton from '@material-ui/core/IconButton';
import Clear from '@material-ui/icons/Clear';
// import Check from '@material-ui/icons/Check';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import InputAdornment from '@material-ui/core/InputAdornment';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Paper from '@material-ui/core/Paper';

import cx from 'classnames';

import customInputStyle from 'material-kit-react-package/dist/assets/jss/material-kit-react/components/customInputStyle';

const popover = {
  position: 'absolute',
  zIndex: 100,
  width: '100%',
};

const popoverContainer = {
  position: 'relative',
  width: '100%',
};

const iconsRoot = {
  padding: 4,
};

const iconsDisabled = {
  color: 'rgba(0, 0, 0, 0.26)!important',
};

const styles = theme => ({
  ...customInputStyle(theme),
  popover,
  popoverContainer,
  iconsRoot,
  iconsDisabled,
});

const MIN_SEARCH_LENGTH = 3;
const DEBOUNCE_TIMEOUT = 400;

class Select extends Component {
  state = {
    menuOpened: false,
    inputText: 'qwe',
    options: [],
    selected: -1,
  }
  // eslint-disable-next-line react/sort-comp
  getInputText(value) {
    const { options, selectValue } = this.props;
    if (selectValue) {
      const option = options.find(item => item.value === value);
      return (option && option.title) || '';
    }
    return (value && value.title) || '';
  }
  componentWillMount() {
    const { value, options } = this.props;
    this.setState({
      inputText: this.getInputText(value),
      options: options || [],
    });
    this.MIN_SEARCH_LENGTH = MIN_SEARCH_LENGTH;
  }
  componentWillReceiveProps(nextProps) {
    const { value } = this.props;
    const { value: newValue } = nextProps;
    if (value !== newValue) {
      this.setState({ inputText: this.getInputText(newValue) });
    }
  }
  inputRef = (ref) => {
    this.input = ref;
  }
  handleInputChange = async (e) => {
    const inputText = e.target.value;
    const { options, getOptions } = this.props;
    if (getOptions) {
      if (inputText.length < this.MIN_SEARCH_LENGTH) {
        this.setState({ inputText });
        return;
      }
      if (this.timeout) {
        clearTimeout(this.timeout);
        this.timeout = undefined;
      }
      this.timeout = setTimeout(async () => {
        const optionsGet = await getOptions(inputText);
        this.setState({
          options: optionsGet,
          selected: 0,
          menuOpened: true,
        });
      }, DEBOUNCE_TIMEOUT);

      this.setState({
        inputText,
      });
    } else {
      const filteredOptions = options.filter(item =>
        item.title.toUpperCase().indexOf(inputText.toUpperCase()) > -1);
      this.setState({
        inputText,
        options: filteredOptions,
        selected: 0,
      });
      if (inputText.length >= this.MIN_SEARCH_LENGTH) {
        this.handleOpen();
      }
    }
  }
  handleKeyDown = (e) => {
    const { selected, options } = this.state;
    switch (e.keyCode) {
      case 38: // key down
        if (selected > 0) {
          this.setState({
            selected: selected - 1,
          });
        }

        e.preventDefault();
        e.stopPropagation();
        break;
      case 40: // key up
        if (selected < options.length - 1) {
          this.setState({
            selected: selected + 1,
          });
        }

        e.preventDefault();
        e.stopPropagation();
        break;
      case 13: // enter
        this.handleSelectOption(options[selected]);
        break;
      case 27: // esc
        this.setState({
          menuOpened: false,
          inputText: '',
        });
        break;
      default:
    }
  }
  handleOpen = () => this.setState({ menuOpened: true });
  handleClose = () => this.setState({ menuOpened: false });
  handleSwitch = async () => {
    const { getOptions } = this.props;
    if (getOptions && !this.state.menuOpened) {
      this.setState({
        menuOpened: !this.state.menuOpened,
        options: await getOptions(),
      });
    } else {
      this.setState({ menuOpened: !this.state.menuOpened });
    }
  }
  handleSelectOption = (value) => {
    this.props.onChange(this.props.selectValue ? value && value.value : value);
    this.setState({
      inputText: (value && value.title) || '',
    });
    this.handleClose();
  }
  handleBlur = () => {
    // input blur fires before click on options list
    // need timeout to catch options click
    setTimeout(() => {
      const { selected, options, menuOpened } = this.state;
      if (menuOpened && selected > -1 && options[selected]) {
        this.handleSelectOption(options[selected]);
      } else if (menuOpened) {
        this.handleClose();
      }
    }, 500);
  }
  handleClear = () => this.handleSelectOption(null);
  // eslint-disable-next-line react/sort-comp
  handleFocus = () => {
    const { openOnFocus } = this.props;
    if (openOnFocus) {
      this.handleSwitch();
    }
  }
  render() {
    const {
      classes,
      formControlProps,
      labelText,
      id,
      labelProps,
      inputProps,
      error,
      success,
      inputRootCustomClasses,
      white,
      disabled,
      noClear,
      optionStyle,
    } = this.props;

    const {
      options,
      inputText,
      selected,
      menuOpened,
    } = this.state;

    const labelClasses = cx({
      [classes.labelRootError]: error,
      [classes.labelRootSuccess]: success && !error,
    });
    const underlineClasses = cx({
      [classes.underlineError]: error,
      [classes.underlineSuccess]: success && !error,
      [classes.underline]: true,
      [classes.whiteUnderline]: white,
    });
    const marginTop = cx({
      [classes.marginTop]: labelText === undefined,
      [inputRootCustomClasses]: inputRootCustomClasses !== undefined,
    });
    const inputClasses = cx({
      [classes.input]: true,
      [classes.whiteInput]: white,
    });
    const formControlClasses = cx({
      [classes.formControl]: true,
      [classes.formControlLabel]: labelText !== undefined,
      [formControlProps.className]: formControlProps.className !== undefined,
    });
    return (
      <Fragment>
        <FormControl
          {...formControlProps}
          className={formControlClasses}
          onBlur={this.handleBlur}
          onFocus={this.handleFocus}
        >
          {labelText !== undefined ? (
            <InputLabel
              className={`${classes.labelRoot} ${labelClasses}`}
              htmlFor={id}
              {...labelProps}
            >
              {labelText}
            </InputLabel>
          ) : null}
          <Input
            classes={{
              input: inputClasses,
              root: marginTop,
              disabled: classes.disabled,
              underline: underlineClasses,
            }}
            id={id}
            inputRef={this.inputRef}
            value={inputText}
            onChange={this.handleInputChange}
            onKeyDown={this.handleKeyDown}
            disabled={disabled}
            inputProps={{ autoComplete: 'off' }}
            {...inputProps}
            endAdornment={
              [
                <InputAdornment position="end" key={1}>
                  <IconButton
                    onClick={this.handleSwitch}
                    disabled={disabled}
                    classes={{ root: classes.iconsRoot }}
                  >
                    <KeyboardArrowDown className={disabled ? classes.iconsDisabled : undefined} />
                  </IconButton>
                </InputAdornment>,
                noClear ? null : (
                  <InputAdornment position="end" key={2}>
                    <IconButton
                      onClick={this.handleClear}
                      disabled={disabled}
                      classes={{ root: classes.iconsRoot }}
                    >
                      <Clear className={(disabled) ? classes.iconsDisabled : undefined} />
                    </IconButton>
                  </InputAdornment>
                ),
              ]
            }
          />
          {/*
            // eslint-disable-next-line no-nested-ternary
            error ? (
              <Clear className={`${classes.feedback} ${classes.labelRootError}`} />
            ) : success ? (
              <Check className={`${classes.feedback} ${classes.labelRootSuccess}`} />
            ) : null
            */}
        </FormControl>
        {
          menuOpened && (
            <div className={classes.popoverContainer}>
              <div className={classes.popover}>
                <Paper
                  id="simple-menu"
                >
                  <MenuList>
                    {
                      (options || []).map((option, index) => (
                        <MenuItem
                          // eslint-disable-next-line react/no-array-index-key
                          key={index}
                          onClick={() => this.handleSelectOption(option)}
                          selected={index === selected}
                          style={optionStyle ? optionStyle(option) : undefined}
                        >
                          {option.title}
                        </MenuItem>
                      ))
                    }
                  </MenuList>
                </Paper>
              </div>
            </div>
          )
        }
      </Fragment>
    );
  }
}

export default withStyles(styles)(Select);
