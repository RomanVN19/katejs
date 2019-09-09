/* eslint-disable react/no-multi-comp */

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
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import IconButton from '@material-ui/core/IconButton';

import Delete from '@material-ui/icons/Delete';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import ArrowDownward from '@material-ui/icons/ArrowDownward';

import Hidden from '@material-ui/core/Hidden';
import Card from 'material-kit-react-package/dist/components/Card/Card';
import CardBody from 'material-kit-react-package/dist/components/Card/CardBody';

import { KateForm, getIn, createContent } from 'kate-form';

import { Elements } from '../components';
import tableStyle from './tableStyle';

class TableDesktop extends Component {
  componentWillMount() {
    this.props.mapRows(this.props.tableData || []);
  }
  componentWillReceiveProps(nextProps) {
    const { tableData } = this.props;
    if (tableData !== nextProps.tableData) {
      this.props.mapRows(nextProps.tableData || []);
    }
  }
  render() {
    const { classes, tableHead, tableRows, tableHeaderColor, path, t, hideRowActions } = this.props;
    return (
      <Table className={classes.table} onKeyDown={this.handleKeyDown}>
        {tableHead !== undefined ? (
          <TableHead className={classes[`${tableHeaderColor}TableHeader`]}>
            <TableRow>
              {tableHead.map(({ title, width }, key) => (
                <TableCell
                  className={`${classes.tableCell} ${classes.tableHeadCell}`}
                  key={key}
                  width={width}
                >
                  {t(title)}
                </TableCell>
              ))}
              {
                !hideRowActions && <TableCell className={classes.actionCell} />
              }
            </TableRow>
          </TableHead>
        ) : null}
        <TableBody>
          {(tableRows || []).map((prop, rowIndex) => (
            <TableRow key={rowIndex} >
              {tableHead.map((column, columnIndex) => (
                <TableCell className={classes.tableCell} key={columnIndex}>
                  {/* column.title */}
                  {
                    column.dataPath === 'rowNumber' ? (`${rowIndex + 1}`) : (
                      <KateForm path={`${path}.rows.${rowIndex}.${columnIndex}`} />
                    )
                  }
                </TableCell>
              ))}
              {
                !hideRowActions && (
                  <TableCell className={classes.actionCell}>
                    <IconButton
                      onClick={() => this.props.moveUp(rowIndex)}
                      disabled={rowIndex === 0}
                    >
                      <ArrowUpward />
                    </IconButton>
                    <IconButton
                      onClick={() => this.props.moveDown(rowIndex)}
                      disabled={rowIndex === tableRows.length - 1}
                    >
                      <ArrowDownward />
                    </IconButton>
                    <IconButton
                      onClick={() => this.props.delete(rowIndex)}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                )
              }
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }
}

class TableMobile extends Component {
  componentWillMount() {
    this.props.mapRows(this.props.tableData || [], true);
  }
  componentWillReceiveProps(nextProps) {
    const { tableData } = this.props;
    if (tableData !== nextProps.tableData) {
      this.props.mapRows(nextProps.tableData || [], true);
    }
  }
  render() {
    const { classes, tableHead, tableRows, path, t, hideRowActions } = this.props;
    return (
      <Fragment>
        {(tableRows || []).map((prop, rowIndex) => (
          <Card key={rowIndex}>
            <CardBody style={{ padding: 10 }}>
              {tableHead.map((column, columnIndex) => (
                <Fragment key={columnIndex}>
                  {
                    column.dataPath === 'rowNumber' ? (`${rowIndex + 1}`) : (
                      <KateForm path={`${path}.rows.${rowIndex}.${columnIndex}`} />
                    )
                  }
                </Fragment>
              ))}
              {
                !hideRowActions && (
                  <div>
                    <IconButton
                      onClick={() => this.props.moveUp(rowIndex)}
                      disabled={rowIndex === 0}
                    >
                      <ArrowUpward />
                    </IconButton>
                    <IconButton
                      onClick={() => this.props.moveDown(rowIndex)}
                      disabled={rowIndex === tableRows.length - 1}
                    >
                      <ArrowDownward />
                    </IconButton>
                    <IconButton
                      onClick={() => this.props.delete(rowIndex)}
                    >
                      <Delete />
                    </IconButton>
                  </div>
                )
              }
            </CardBody>
          </Card>
        ))}
      </Fragment>
    );
  }
}

class CustomTableEditable extends Component {
  componentWillMount() {
    // this.mapRows(this.props.tableData || []);
    this.props.setData('getRow', this.getRow);
    this.props.setData('addRow', this.addRow);
  }
  componentWillReceiveProps(nextProps) {
    const { tableData, getRow, setData } = this.props;
    // if (tableData !== nextProps.tableData) {
    //   this.mapRows(nextProps.tableData || []);
    // }
    if (getRow && !nextProps.getRow) {
      setData('getRow', this.getRow);
      setData('addRow', this.addRow);
    }
  }
  shouldComponentUpdate(nextProps) {
    if (this.props.tableData !== nextProps.tableData) return true;
    if (!nextProps.tableRows || !nextProps.tableData ||
      nextProps.tableRows.length !== nextProps.tableData.length) return false;
    return true;
  }

  getRow = index => createContent(this.getRowData(index), this.setRowData(index))
  getRowData = index => () => (this.props.tableRows[index]);
  setRowData = index => (path, value) => {
    this.props.setData(`rows.${index}.${path}`, value);
    const paths = path.split('.');
    if (paths[1] === 'value') {
      const columns = this.props.tableHead;
      this.props.setData(`value.${index}.${columns[paths[0]].dataPath}`, value);
    }
  }

  mapRows = (data, showTitle) => {
    const { tableHead: columns, setData } = this.props;
    const rows = data.map((row, rowIndex) =>
      columns.map(({ dataPath, title, onChange, onClick, getElement, ...rest }, colIndex) => {
        let element = {};
        if (getElement) {
          element = getElement(getIn(row, dataPath || ''));
        }
        const value = getIn(row, dataPath || '');
        let cellTitle = showTitle && title;
        if (rest.type === Elements.LABEL && value) cellTitle = undefined;
        return {
          title: cellTitle,
          value,
          ...element,
          onChange: val =>
            this.rowChange(rowIndex, dataPath, val, colIndex, element.onChange || onChange),
          onClick: (onClick || element.onClick)
            && (() => this.rowClick(rowIndex, element.onClick || onClick)),
          ...rest,
          autoFocus: value ? undefined : rest.autoFocus,
        };
      }));
    setData('rows', rows);
  }
  rowChange = (rowIndex, field, value, colIndex, onChange) => {
    this.props.setData(`value.${rowIndex}.${field}`, value);
    if (onChange) {
      onChange(this.getRow(rowIndex), colIndex);
    }
  }
  rowClick = (rowIndex, onClick) => onClick(this.getRow(rowIndex), this.props.tableData[rowIndex]);
  addRow = (value = {}) => {
    const { tableData, setData } = this.props;
    setData('value', tableData ? [...tableData, value] : [value]);
  }
  moveUp = (index) => {
    const { tableData, setData } = this.props;
    tableData.splice(index - 1, 0, tableData.splice(index, 1)[0]);
    setData('value', [...tableData]);
  }
  moveDown = (index) => {
    const { tableData, setData } = this.props;
    tableData.splice(index + 1, 0, tableData.splice(index, 1)[0]);
    setData('value', [...tableData]);
  }
  delete = (index) => {
    const { tableData, setData, onDelete } = this.props;
    const row = tableData.splice(index, 1);
    setData('value', [...tableData]);
    if (onDelete) onDelete(row);
  }
  handleKeyDown = (e) => {
    if (e.keyCode === 13) this.addRow();
  }
  render() {
    const { classes, tableHead, tableRows, tableHeaderColor, path, t, hideRowActions, tableData } = this.props;
    return (
      <Fragment>
        <Hidden only={['xs']} implementation="js">
          <div className={classes.tableEditable}>
            <TableDesktop
              classes={classes}
              tableHead={tableHead}
              tableRows={tableRows}
              tableHeaderColor={tableHeaderColor}
              path={path}
              t={t}
              hideRowActions={hideRowActions}
              mapRows={this.mapRows}
              tableData={tableData}
              moveUp={this.moveUp}
              moveDown={this.moveDown}
              delete={this.delete}
            />
          </div>
        </Hidden>
        <Hidden only={['sm', 'md', 'lg', 'xl']} implementation="js">
          <TableMobile
            classes={classes}
            tableHead={tableHead}
            tableRows={tableRows}
            tableHeaderColor={tableHeaderColor}
            path={path}
            t={t}
            hideRowActions={hideRowActions}
            mapRows={this.mapRows}
            tableData={tableData}
            moveUp={this.moveUp}
            moveDown={this.moveDown}
            delete={this.delete}
          />
        </Hidden>
      </Fragment>
    );
  }
}


CustomTableEditable.defaultProps = {
  tableHeaderColor: 'gray',
};

export default withStyles(tableStyle)(CustomTableEditable);
