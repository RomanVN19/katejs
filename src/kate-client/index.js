import 'babel-polyfill';
import 'whatwg-fetch';

import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { Router, Route, Redirect } from 'react-router-dom';
import { createBrowserHistory } from 'history';

import { getIn } from 'kate-form';

import configureStore from './store';
import registerServiceWorker from './registerServiceWorker';

import KateComponent from './kate-component';

import App from './classes/App';
import Form from './classes/Form';


const KateClient = ({ app, translations, pwa }) => {
  const history = createBrowserHistory();
  const store = configureStore();

  ReactDOM.render(
    <Provider store={store}>
      <Router history={history}>
        <Fragment>
          <Route
            path={app.path}
            render={props => <KateComponent app={app} translations={translations} {...props} />}
          />
          {
            app.path && app.path !== '/' && (
              <Route exact path="/" render={() => <Redirect to={app.path} />} />
            )
          }
        </Fragment>
      </Router>
    </Provider>,
    document.getElementById('root'),
  );
  if (pwa) {
    registerServiceWorker();
  }
};

export default KateClient;
export {
  App,
  Form,
  getIn,
};
