import React from 'react';
import { getIn } from '../../kate-form';
import { withStyles } from '@material-ui/core/styles';
import ResponsiveTable from './TableResponsive/index';
import tableStyle from './tableStyle';


import { formatValue } from './TablePlain';

function CustomTableResponsive({ ...props }) {
  const {
    tableHead, tableData, classes,
    rowClick, cellStyle = () => ({}), headStyle,
    t, ...rest
  } = props;
  const columns = tableHead && tableHead.map((c, i) => ({
    ...c,
    key: `c${i}`,
    label: t(c.title),
    renderLabel: col => col.label,
    render: (value, row, data, column) => `${formatValue(column.format, getIn(row, column.dataPath))}`,
  }));
  const rowClickHandler = index => rowClick && rowClick(tableData[index], index);
  return (
    <ResponsiveTable
      TableProps={{ className: classes.table }}
      TableHeadCellProps={{ className: `${classes.tableCell} ${classes.tableHeadCell}` }}
      TableBodyCellProps={{ className: classes.tableCell }}
      TableHeadRowProps={{ style: headStyle }}
      TableHeadProps={{ className: classes.primaryTableHeader }}
      columns={columns}
      data={tableData}
      rowClick={rowClickHandler}
      cellStyle={cellStyle}
      noContentText="-"
      listBreakpoints={['sm', 'md', 'lg', 'xl']}
      tableBreakpoints={['xs']}
      {...rest}
    />
  );
}

export default withStyles(tableStyle)(CustomTableResponsive);
