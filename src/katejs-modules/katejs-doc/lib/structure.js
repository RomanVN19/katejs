import Fields from 'katejs/lib/fields';

const Doc = {
  fields: [
    {
      name: 'number',
      type: Fields.INTEGER,
    },
    {
      name: 'date',
      type: Fields.DATE,
    },
    {
      name: 'title',
      type: Fields.STRING,
      skipForForm: true,
    },
  ],
};

const Record = {
  fields: [
    {
      name: 'date',
      type: Fields.DATE,
    },
    {
      name: 'entity',
      type: Fields.STRING,
    },
    {
      name: 'docUuid',
      type: Fields.STRING,
    },
    {
      name: 'docTitle',
      type: Fields.STRING,
    },
  ],
};

export const packageName = 'katejs-doc';

export const structures = {
  Doc,
  Record,
};
