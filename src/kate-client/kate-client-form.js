import React, { Component } from 'react';
import { KateForm, withKateForm } from 'kate-form';

class KateClientForm extends Component {
  constructor(props) {
    super(props);
    const {
      Form, setData, data,
      getValues, setValues,
      app,
      location: { search = '' },
      kateFormContent,
    } = props;
    const params = {};
    search.replace('?', '').split('&').forEach((param) => {
      const [paramName, paramValue] = param.split('=');
      if (paramName && paramValue) {
        params[paramName] = paramValue;
      }
    });
    this.APP = app;
    this.FORM = new Form({
      sys: {
        data,
        setData,
        getData: this.getData,
        getValues,
        setValues,
        app,
        kateFormContent,
      },
      params,
    });
    this.FORM.init();
  }
  shouldComponentUpdate(nextProps) {
    // content can be updated after setData for non Proxy browsers
    this.FORM.content = nextProps.kateFormContent;
    return this.props.data !== nextProps.data;
  }
  // components updates every time when root data changes
  componentDidUpdate() {
    if (this.FORM.afterUpdate) this.FORM.afterUpdate();
  }
  componentWillUnmount() {
    if (this.FORM.beforeUnmount) this.FORM.beforeUnmount();
    // each form has it own store. need to clear
    this.props.setData('', null);
  }
  getData = () => this.props.data;
  render() {
    const { kateFormPath } = this.props;
    return (
      <KateForm path={kateFormPath} />
    );
  }
}

const KateFormConnected = kateFormPath =>
  withKateForm(KateClientForm, kateFormPath);

export default KateFormConnected;
