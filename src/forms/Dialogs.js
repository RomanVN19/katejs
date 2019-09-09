/* eslint-disable no-param-reassign */
import { Elements } from '../client';

const ConfirmDialog = ({ form, id }) => {
  let resolveFunc;
  const confirm = ({ title }) => {
    form.content[`${id}_label`].title = title;
    form.content[id].open = true;
    return new Promise((resolve) => {
      resolveFunc = resolve;
    });
  };
  const cancel = () => {
    if (resolveFunc) resolveFunc(false);
    form.content[id].open = false;
  };
  const ok = () => {
    if (resolveFunc) resolveFunc(true);
    form.content[id].open = false;
  };
  return {
    id,
    type: Elements.MODAL,
    open: false,
    confirm,
    handleClose: cancel,
    elements: [
      {
        type: Elements.MODAL_ACTIONS,
        elements: [
          {
            type: Elements.BUTTON,
            title: 'Ok',
            onClick: ok,
          },
          {
            type: Elements.BUTTON,
            title: 'Cancel',
            onClick: cancel,
          },
        ],
      },
      {
        id: `${id}_label`,
        type: Elements.LABEL,
        tag: 'h4',
      },
    ],
  };
};

export {
  ConfirmDialog,
};
