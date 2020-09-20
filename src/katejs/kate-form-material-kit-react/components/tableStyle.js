
/*
Copyright © 2018 Roman Nep <neproman@gmail.com>
*/

// ##############################
// // // Table styles
// #############################

import {
  warningColor,
  dangerColor,
  successColor,
  infoColor,
  roseColor,
  grayColor,
  defaultFont,
} from 'material-kit-react-package/dist/assets/jss/material-kit-react';

const tableStyle = theme => ({
  warningTableHeader: {
    color: warningColor,
  },
  primaryTableHeader: {
    color: theme.palette.primary.main,
  },
  dangerTableHeader: {
    color: dangerColor,
  },
  successTableHeader: {
    color: successColor,
  },
  infoTableHeader: {
    color: infoColor,
  },
  roseTableHeader: {
    color: roseColor,
  },
  grayTableHeader: {
    color: grayColor,
  },
  table: {
    marginBottom: '0',
    width: '100%',
    maxWidth: '100%',
    backgroundColor: 'transparent',
    borderSpacing: '0',
    borderCollapse: 'collapse',
  },
  tableHeadCell: {
    color: 'inherit',
    ...defaultFont,
    fontSize: '1em',
  },
  tableCell: {
    ...defaultFont,
    lineHeight: '1.42857143',
    padding: '12px 8px',
    verticalAlign: 'middle',
  },
  tableResponsive: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  tableEditable: {
    width: '100%',
    // overflowX: 'auto', // TODO: set this on small screen
  },
  actionCell: {
    width: 150,
    padding: 0,
    '&:last-child': {
      padding: 0,
    },
  },
  cardMargin: {
    marginTop: 54,
  },
  headerSpan: {
    marginRight: 10,
  },
});

export default tableStyle;
