import Fields from 'katejs/lib/fields';

const PrintTemplate = {
  fields: [
    {
      name: 'title',
      type: Fields.STRING,
    },
    {
      name: 'content',
      type: Fields.TEXT,
      skipForList: true,
      rows: 10,
    },
  ],
};

export const packageName = 'katejs-print';
export const structures = {
  PrintTemplate,
};
