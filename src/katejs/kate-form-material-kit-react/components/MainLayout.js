
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

import React, { Component } from 'react';
import { NavLink, Switch, Route, Redirect } from 'react-router-dom';

import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuIcon from '@material-ui/icons/Menu';
import AppIcon from '@material-ui/icons/AppsOutlined';
import DocIcon from '@material-ui/icons/Description';

import InfoOutline from '@material-ui/icons/InfoOutlined';
import Check from '@material-ui/icons/Check';
import Warning from '@material-ui/icons/Warning';
import Snackbar from 'material-kit-react-package/dist/components/Snackbar/SnackbarContent';

import { withStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import cx from 'classnames';

import Scrollbar from 'react-custom-scrollbars';

import { defaultFont, theme as kitTheme, getThemeColors } from 'material-kit-react-package/dist/assets/jss/material-kit-react';

const defaultTheme = createMuiTheme(kitTheme);

const drawerWidth = 250;
const collapsedDrawerWidth = 56;
const styles = theme => ({
  root: {
    display: 'flex',
  },
  main: {
    padding: 20,
    flex: 1,
  },
  drawerPaper: {
    width: collapsedDrawerWidth,
    backgroundColor: '#222222',
    transition: 'all 100ms linear',
  },
  drawerOpen: {
    width: drawerWidth,
  },
  list: {
    '& svg path': {
      color: '#fff',
    },
    '& span': {
      color: '#fff',
    },
    '& div': {
      paddingLeft: 16,
      paddingRight: 16,
    },
  },
  currentItem: {
    backgroundColor: theme.palette.primary.main,
    boxShadow: `0 12px 20px -10px ${theme.palette.primary.shadow}, 0 4px 20px 0px rgba(0, 0, 0, 0.12), 0 7px 8px -5px ${theme.palette.primary.shadow}`,
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
      boxShadow: `0 12px 20px -10px ${theme.palette.primary.shadow}, 0 4px 20px 0px rgba(0, 0, 0, 0.12), 0 7px 8px -5px ${theme.palette.primary.shadow}`,
    },
  },
  listItem: {
    width: 'auto',
    transition: 'all 300ms linear',
    margin: '10px 15px 0',
    borderRadius: '3px',
    position: 'relative',
    ...defaultFont,
    '&:hover': {
      backgroundColor: '#666666',
    },
  },
  icon: {
    margin: 0,
    width: 24,
    height: 24,
  },
  iconLogo: {
    margin: 0,
    width: 48,
    height: 48,
  },
  listItemCollapsed: {
    margin: '10px 0 0',
  },
  snackbar: {
    position: 'fixed',
    bottom: 0,
    width: '100%',
    zIndex: 1300,
  },
});


const renderThumb = ({ style, ...props }) => {
  const thumbStyle = {
    backgroundColor: '#bbbbbb',
    borderRadius: 3,
  };
  return (
    <div
      style={{ ...style, ...thumbStyle }}
      {...props}
    />
  );
};

const renderMergedProps = (component, ...rest) => {
  const finalProps = Object.assign({}, ...rest);
  return (
    React.createElement(component, finalProps)
  );
};

const PropsRoute = ({ component, ...rest }) => (
  <Route
    {...rest}
    render={routeProps => renderMergedProps(component, routeProps, rest)}
  />
);

class MainLayout extends Component {
  state = {
    drawerOpen: true,
    alerts: [],
  };
  getAlertIcon = (type) => {
    switch (type) {
      case 'danger':
        return Warning;
      case 'success':
        return Check;
      default:
        return InfoOutline;
    }
  }
  switchDrawer = () => this.setState({ drawerOpen: !this.state.drawerOpen })

  showAlert = (alert) => {
    const { alerts } = this.state;
    // eslint-disable-next-line no-param-reassign
    alert.timestamp = new Date().getTime() + ((alert.timeout || 2) * 1000);
    alerts.push(alert);
    this.setState({ alerts });
    setTimeout(() => {
      const { alerts: alertsToCheck } = this.state;
      const now = new Date().getTime();
      const newAlerts = alertsToCheck.filter(item => item.timestamp > now);
      this.setState({ alerts: newAlerts });
    }, ((alert.timeout || 2) * 1000) + 100);
  }
  t = this.props.t || (term => term)
  render() {
    const {
      routes, menu, classes, location, title,
      titlePath, logo, alerts,
    } = this.props;
    const { drawerOpen, alerts: stateAlerts } = this.state;

    const drawerContent = (
      <List className={classes.list}>
        <NavLink to={titlePath || '/'}>
          <ListItem
            button
            className={cx(classes.listItem, {
              [classes.listItemCollapsed]: !drawerOpen,
            })}
          >
            <ListItemIcon className={drawerOpen ? classes.iconLogo : classes.icon}>
              { logo ? <img src={logo} alt="logo" /> : <AppIcon />}
            </ListItemIcon>
            { drawerOpen ?
              <ListItemText primary={this.t(title)} />
              : null }
          </ListItem>
        </NavLink>

        <ListItem
          button
          onClick={this.switchDrawer}
          className={cx(classes.listItem, { [classes.listItemCollapsed]: !drawerOpen })}
        >
          <ListItemIcon className={classes.icon}><MenuIcon /></ListItemIcon>
          { drawerOpen ? <ListItemText primary={this.t('Collapse')} /> : null }
        </ListItem>
        {
          (menu || routes).map((route) => {
            const menuItem = (
              <ListItem
                button
                onClick={route.onClick}
                key={route.onClick}
                className={cx(classes.listItem, {
                  [classes.listItemCollapsed]: !drawerOpen,
                  [classes.currentItem]: location.pathname.indexOf(route.path) === 0,
                })}
              >
                <ListItemIcon className={classes.icon}>
                  { route.icon ? <route.icon /> : <DocIcon />}
                </ListItemIcon>
                { drawerOpen ?
                  <ListItemText primary={route.title} />
                  : null }
              </ListItem>
            );
            if (route.path) {
              return (
                <NavLink to={route.path} key={route.path}>
                  {menuItem}
                </NavLink>
              );
            }
            return menuItem;
          })
        }
        <ListItem>
          <ListItemText primary="" />
        </ListItem>

      </List>
    );

    return (
      <div className={classes.root}>
        <Hidden smDown>
          <Drawer
            variant="permanent"
            anchor="left"
            classes={{
              docked: cx(classes.drawerPaper, { [classes.drawerOpen]: drawerOpen }),
              paper: cx(classes.drawerPaper, { [classes.drawerOpen]: drawerOpen }),
            }}
          >
            <Scrollbar
              renderThumbVertical={renderThumb}
              autoHide
            >
              {drawerContent}
            </Scrollbar>
          </Drawer>
        </Hidden>
        <Hidden mdUp>
          {
            drawerOpen ? (
              <Drawer
                variant="temporary"
                anchor="left"
                classes={{
                  docked: cx(classes.drawerPaper, { [classes.drawerOpen]: drawerOpen }),
                  paper: cx(classes.drawerPaper, { [classes.drawerOpen]: drawerOpen }),
                }}
                open
              >
                {drawerContent}
              </Drawer>
            ) : (
              <Drawer
                variant="permanent"
                anchor="left"
                classes={{
                  docked: cx(classes.drawerPaper, { [classes.drawerOpen]: drawerOpen }),
                  paper: cx(classes.drawerPaper, { [classes.drawerOpen]: drawerOpen }),
                }}
              >
                {drawerContent}
              </Drawer>
            )
          }
        </Hidden>
        <main className={classes.main}>
          <Switch>
            {
              // eslint-disable-next-line no-confusing-arrow
              routes.map(route => route.redirect ? (
                <Redirect
                  key={`redirect ${route.redirect}`}
                  to={route.redirect}
                />
              ) : (
                <PropsRoute
                  key={route.path}
                  component={route.component}
                  path={route.path}
                  showAlert={this.showAlert}
                />
              ))
            }
          </Switch>
        </main>
        <div className={classes.snackbar}>
          {
            (alerts || stateAlerts).map(alert => (
              <Snackbar
                key={`${alert.title}${alert.desciption}`}
                message={
                  <span>
                    <b>{alert.title}</b> {alert.desciption}
                  </span>
                }
                close
                color={alert.type || 'info'}
                icon={this.getAlertIcon(alert.type)}
              />
            ))
          }
        </div>
      </div>
    );
  }
}

const Layout = withStyles(styles)(MainLayout);

let userColorTheme;
const StyledLayout = (props) => {
  if (props.primaryColor && !userColorTheme) {
    userColorTheme = createMuiTheme({
      palette: {
        primary: getThemeColors(props.primaryColor),
      },
    });
  }
  return (
    <MuiThemeProvider theme={userColorTheme || defaultTheme}>
      <Layout {...props} />
    </MuiThemeProvider >
  );
};

export default StyledLayout;
