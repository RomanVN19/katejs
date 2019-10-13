import Fields from 'katejs/lib/fields';

const ActionLog = {
  fields: [
    {
      name: 'entity',
      type: Fields.STRING,
    },
    {
      name: 'method',
      type: Fields.STRING,
    },
    {
      name: 'status',
      type: Fields.INTEGER,
    },
    {
      name: 'userTitle',
      type: Fields.STRING,
    },
    {
      name: 'userId',
      type: Fields.STRING,
    },
    {
      name: 'objectTitle',
      type: Fields.STRING,
    },
    {
      name: 'objectId',
      type: Fields.STRING,
    },
    {
      name: 'data',
      type: Fields.TEXT,
    },
  ],
};

export const title = 'Log';
export const packageName = 'katejs-apilog';
export const structures = {
  ActionLog,
};
