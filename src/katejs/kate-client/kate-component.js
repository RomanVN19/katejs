import React, { Component } from 'react';

import { KateFormProvider } from 'kate-form';
import { Switch, Route, Redirect } from 'react-router-dom';
import { currentLayout, currentForms } from './classes/App';
import KateClientForm from './kate-client-form';

class KateComponent extends Component {
  constructor(props) {
    super(props);
    const { app: App, match, translations } = this.props;
    this.APP = new App({
      history: this.props.history,
      path: App.path || '/',
      translations,
    });
    this.state = { layouts: [] };
    const path = match.path === '/' ? '' : match.path;

    Object.keys(this.APP.layouts).forEach((layoutName) => {
      const layout = Object.assign({}, this.APP.layouts[layoutName]);
      layout.name = layoutName;
      if (!layout.areas) {
        layout.path = `${path}/${layoutName}/:content`;
      } else {
        const areas = Object.keys(layout.areas).sort();
        const paths = areas.map(item => `/:${item}`).join('');
        layout.path = `${path}/${layoutName}${paths}`;
      }
      layout.render = this.getLayoutRender(layout);
      this.state.layouts.push(layout);
    });
    if (this.APP.defaultLayout) {
      const l = this.APP.defaultLayout;
      this.state.defaultRedirect = this.APP.getPath(l.layout, l.areas, l.params);
    }
    if (this.APP.afterInit) this.APP.afterInit();
    // setTimeout(this.afterInitCall, 0);
  }
  // eslint-disable-next-line react/sort-comp
  // afterInitCall = () => {
  //   if (this.APP.afterInit) this.APP.afterInit();
  // }

  getLayoutRender(layout) {
    const LayoutComponent = layout.component;
    const { forms } = this.APP;

    return (props) => {
      this.APP[currentLayout] = layout.name;
      const { match: { params } } = props;
      let content;
      if (layout.areas) {
        content = {};
        const contentMemo = layout.memo || { params: {} };
        Object.keys(layout.areas).forEach((areaName) => {
          if (forms[params[areaName]]) {
            this.APP[currentForms][areaName] = params[areaName];
            if (contentMemo.params[areaName] === params[areaName]) {
              content[areaName] = contentMemo.content[areaName];
            } else {
              const ClientForm = KateClientForm(`${areaName}-${params[areaName]}`);
              content[areaName] = (
                <ClientForm
                  Form={forms[params[areaName]]}
                  app={this.APP}
                  {...props}
                />
              );
            }
          } else if (params[areaName] === 'none') {
            content[areaName] = null;
          } else {
            content[areaName] = params[areaName];
          }
        });
      } else if (forms[params.content]) {
        const ClientForm = KateClientForm(`content-${params.content}`);
        content = (
          <ClientForm
            Form={forms[params.content]}
            app={this.APP}
            {...props}
          />
        );
      } else {
        // eslint-disable-next-line prefer-destructuring
        content = params.content;
      }
      // eslint-disable-next-line no-param-reassign
      layout.memo = { content, params };
      return <LayoutComponent content={content} app={this.APP} />;
    };
  }
  render() {
    const { app } = this.props;
    const { layouts, defaultRedirect } = this.state;
    return (
      <KateFormProvider components={app.components} t={this.APP.t} logRerender={app.logRerender} >
        <Switch>
          {
            layouts.map(layout => (
              <Route
                key={layout.name}
                path={layout.path}
                component={layout.render}
              />
            ))
          }
          {
            defaultRedirect && <Redirect to={defaultRedirect} />
          }
        </Switch>
      </KateFormProvider>
    );
  }
}

export default KateComponent;
