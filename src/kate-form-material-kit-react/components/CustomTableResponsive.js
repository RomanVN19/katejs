
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
import { getIn } from 'kate-form';
import { withStyles } from '@material-ui/core/styles';
import ResponsiveTable from './TableResponsive/index';
import tableStyle from './tableStyle';


import { formatValue } from './TablePlain';

function CustomTableResponsive({ ...props }) {
  const {
    tableHead, tableData, classes,
    rowClick, cellStyle = () => ({}), headStyle,
    t,
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
    />
  );
}

export default withStyles(tableStyle)(CustomTableResponsive);
