/*
Copyright © 2018 Roman Nep <neproman@gmail.com>
*/

import React, { Component } from 'react';

import { withStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { defaultFont, theme as kitTheme, getThemeColors } from 'material-kit-react-package/dist/assets/jss/material-kit-react';
import tooltipStyle from 'material-kit-react-package/dist/assets/jss/material-kit-react/tooltipsStyle';
import LinearProgress from '@material-ui/core/LinearProgress';

const defaultTheme = createMuiTheme({
  ...kitTheme,
  palette: {
    ...kitTheme.palette,
    drawer: {
      main: '#ffffff',
      background: '#222222',
      listHover: '#666666',
    },
  },
});

const drawerWidth = 250;
const collapsedDrawerWidth = 56;
const styles = theme => ({
  root: {
    display: 'flex',
  },
  main: {
    padding: 20,
    flex: 1,
    maxWidth: 'calc(100vw - 270px)',
    margin: 'auto',
  },
  mainDrawerClose: {
    padding: 20,
    flex: 1,
    maxWidth: 'calc(100vw - 60px)',
    margin: 'auto',
  },
  drawerPaper: {
    width: collapsedDrawerWidth,
    backgroundColor: theme.palette.drawer.background,
    transition: 'all 100ms linear',
  },
  drawerOpen: {
    width: drawerWidth,
  },
  list: {
    '& svg path': {
      color: theme.palette.drawer.main,
    },
    '& svg': {
      fill: theme.palette.drawer.main,
    },
    '& span': {
      color: theme.palette.drawer.main,
    },
    '& div': {
      paddingLeft: 16,
      paddingRight: 16,
      color: theme.palette.drawer.main,
    },
  },
  currentItem: {
    '& span': {
      color: '#eeeeee!important',
    },
    '& svg path': {
      color: '#eeeeee!important',
    },
    '& svg': {
      fill: '#eeeeee!important',
    },
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
      backgroundColor: theme.palette.drawer.listHover,
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
  iconLogoFull: {
    margin: 0,
    maxWidth: 200,
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
  tooltip: {
    ...(Object.keys(tooltipStyle.tooltip).reduce((acc, key) => ({ ...acc, [key]: `${tooltipStyle.tooltip[key]}!important` }), {})),
    padding: '16px 15px!important',
    marginLeft: '16px!important',
  },
  listItemNested: {
    width: '100%',
    marginLeft: '0',
    marginRight: '0',
  },
  listItemNestedText: {
    fontSize: '0.8em',
  },
  loadingBlock: {
    width: '100%',
    position: 'fixed',
    zIndex: 1500,
  },
  badge: {
    backgroundColor: theme.palette.primary.main,
    color: '#ffffff!important',
    padding: '0px 5px!important',
    borderRadius: '12px',
  },
  ['@media print']: {
    drawerPaper: {
      display: 'none'
    },
    main: {
      maxWidth: '100%',
      padding: 0,
    },
    mainDrawerClose: {
      maxWidth: '100%',
      padding: 0,
    },
  },
});


export const renderThumb = ({ style, ...props }) => {
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

class MainLayout extends Component {
  constructor(props) {
    super(props);
    this.props.app.layoutClasses = this.props.classes;
    this.props.app.layoutComponent = this;
  }
  render() {
    const {
      classes, content, app,
    } = this.props;

    return (
      <div className={classes.root}>
        {content.leftMenu}
        <div className={app.drawerOpen ? classes.main : classes.mainDrawerClose}>
          {content.main}
        </div>
        <div className={classes.snackbar}>
          {content.alerts}
        </div>
        <div className={classes.loadingBlock} style={{ display: app.loading ? 'block' : 'none' }}>
          <LinearProgress />
        </div>
      </div>
    );
  }
}

const Layout = withStyles(styles)(MainLayout);

let userColorTheme;
const StyledLayout = (props) => {
  const color = props.app.constructor.primaryColor;
  const drawer = props.app.constructor.drawerPalette;
  if (color && !userColorTheme) {
    userColorTheme = createMuiTheme({
      palette: {
        primary: {
          ...getThemeColors(color),
        },
        drawer: {
          main: drawer ? drawer.main : '#ffffff',
          background: drawer ? drawer.background : '#222222',
          listHover: drawer ? drawer.listHover : '#666666',
        },
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
