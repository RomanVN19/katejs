/* eslint-disable arrow-body-style */
import React from 'react';
import KateForm from './KateForm';

const input = ({ onChange, setData, inputType, value, ...props }) => {
  const change = (e) => {
    setData('value', e.target.value);
    if (onChange) onChange(e.target.value);
  };
  return (
    <input onChange={change} type={inputType} value={value || ''} {...props} />
  );
};

const label = ({ title, setData, t, ...props }) => (
  <span {...props}>{t(title)}</span>
);

const subform = ({ path }) => {
  return (
    <KateForm
      path={`${path}.data`}
    />
  );
};

const button = ({ title, setData, ...props }) => (
  <button {...props}>{title}</button>
);

const group = ({ path, elements, layout }) => {
  return (
    <div style={layout === 'horizontal' ? { display: 'flex' } : null}>
      {
        elements.map((item, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <div key={index}>
            <KateForm path={`${path}.elements.${index}`} />
          </div>
        ))
      }
    </div>
  );
};


const Elements = {
  INPUT: Symbol('input'),
  BUTTON: Symbol('button'),
  FORM: Symbol('subform'),
  LABEL: Symbol('label'),
  GROUP: Symbol('group'),
};

const components = {
  [Elements.INPUT]: input,
  [Elements.BUTTON]: button,
  [Elements.FORM]: subform,
  [Elements.LABEL]: label,
  [Elements.GROUP]: group,
};

export {
  components,
  Elements,
};
