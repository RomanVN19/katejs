import React, { Fragment } from 'react';
import { connect } from 'react-redux';

import { getSetData } from './actions';
import { Consumer } from './context';

export const getIn = (obj, path) => {
  if (obj[path]) return obj[path];
  const pathArray = Array.isArray(path) ? path : path.split('.');
  if (pathArray[pathArray.length - 1] === '') pathArray.pop();
  let currentData = obj;
  for (let i = 0; i < pathArray.length && currentData; i += 1) {
    currentData = currentData[pathArray[i]];
  }
  return currentData;
};

const KateForm = (props) => {
  const {
    data, components,
    path, setData,
    logRerender,
    t,
  } = props;
  if (logRerender) console.log('render ', path, data); // eslint-disable-line no-console

  if (!data) {
    // eslint-disable-next-line no-console
    console.error(`[kate-form] Error connecting element: data on path ${path} is null`);
    return null;
  }

  if (Array.isArray(data)) {
    // render sub elements
    return (
      <Fragment>
        {
          data.map((element, index) => (
            <ConnectedKateForm
              key={element.id || index}
              path={`${path}.${index}`}
            />))
        }
      </Fragment>
    );
  }
  // render element
  const { type, ...elementProps } = data;
  if (!data.type || !components[data.type] || data.hidden) return null;
  const ElementComponent = components[data.type];
  return (
    <ElementComponent
      setData={setData}
      path={path}
      t={t}
      {...elementProps}
    />
  );
};

const KateFormWithContext = props => (
  <Consumer>
    {context => (
      <KateForm
        components={context.components}
        logRerender={context.logRerender}
        t={context.t || (value => value)}
        {...props}
      />
    )}
  </Consumer>
);

const mapStateToProps = (state, ownProps) => ({
  data: getIn(state['kate-form'], ownProps.path),
});

const mapDispathToProps = (dispatch, ownProps) => {
  const setData = getSetData(ownProps.path);
  return {
    setData: (path, data) => dispatch(setData(path, data)),
  };
};

const ConnectedKateForm = connect(mapStateToProps, mapDispathToProps)(KateFormWithContext);
export default ConnectedKateForm;
