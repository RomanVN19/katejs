import React, { Component } from 'react';
import { connect } from 'react-redux';

import { getSetData, createContent, getValues, setValues } from './index';

const idCollection = (data, subElementsPath, result) => {
  if (!Array.isArray(data)) {
    return idCollection([data], subElementsPath, result);
  }
  data.forEach((item) => {
    if (item.id) {
      // eslint-disable-next-line no-param-reassign
      result[item.id] = item;
    }
    if (item[subElementsPath]) {
      idCollection(item[subElementsPath], subElementsPath, result);
    }
  });
  return result;
};

const withKateForm = (FormComponent, kateFormPath, subElementsPath = 'elements', kateFormStorePath = 'kate-form') => {
  class withKateFormComponent extends Component {
    constructor(props) {
      super(props);
      const { setData } = props;
      this.content = createContent(this.getData, setData, subElementsPath);
    }
    getData = () => this.props.data;
    setData = (path, data) => {
      if (path === '' && !window.Proxy) { // update elements for non Proxy browers
        const obj = idCollection(data, subElementsPath, {});
        this.content = createContent(
          this.getData,
          this.props.setData,
          subElementsPath,
          undefined,
          obj,
        );
      }
      return this.props.setData(path, data);
    }
    getValues = () => getValues(this.props.data, subElementsPath);
    setValues = values => setValues(values, this.props.data, this.props.setData, subElementsPath)
    init = elements => this.setData('', elements);
    render() {
      return (
        <FormComponent
          {...this.props}
          setData={this.setData}
          kateFormContent={this.content}
          kateFormInit={this.init}
          getValues={this.getValues}
          setValues={this.setValues}
          kateFormPath={kateFormPath}
        />
      );
    }
  }
  const mapStateToProps = state => ({
    data: state[kateFormStorePath][kateFormPath],
  });

  return connect(mapStateToProps, {
    setData: getSetData(kateFormPath),
  })(withKateFormComponent);
};

export default withKateForm;
