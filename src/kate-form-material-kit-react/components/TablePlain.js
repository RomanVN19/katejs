import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';

import { getIn } from '../../kate-form';

import tableStyle from './tableStyle';

export const formatValue = (format, value) => {
  if (format) return format(value);
  if (value === null || value === undefined) return '';
  return typeof value === 'object' ? JSON.stringify(value) : value;
};

function CustomTablePlain({ ...props }) {
  const {
    classes, tableHead, tableData, tableHeaderColor,
    rowClick, cellStyle = () => ({}), t, headStyle, style,
  } = props;
  return (
    <div className={classes.tableResponsive} style={style}>
      <Table className={classes.table}>
        {tableHead !== undefined ? (
          <TableHead className={classes[`${tableHeaderColor}TableHeader`]}>
            <TableRow style={headStyle}>
              {tableHead.map(({ title, width, style }, key) => (
                <TableCell
                  className={`${classes.tableCell} ${classes.tableHeadCell}`}
                  key={key}
                  width={width}
                  style={style}
                >
                  {t(title)}
                </TableCell>
                ))}
            </TableRow>
          </TableHead>
        ) : null}
        <TableBody>
          {tableData.map((data, index) => (
            <TableRow
              key={index}
              onClick={() => rowClick && rowClick(data, index)}
            >
              {tableHead.map((column, key) => (
                <TableCell
                  className={classes.tableCell}
                  key={key}
                  style={{
                    maxWidth: column.maxWidth || 'unset',
                    ...cellStyle(data, column),
                  }}
                >
                  {`${formatValue(column.format, getIn(data, column.dataPath))}`}
                </TableCell>
              ))}
            </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}

CustomTablePlain.defaultProps = {
  tableHeaderColor: 'gray',
};

export default withStyles(tableStyle)(CustomTablePlain);
