import Fields from 'katejs/lib/fields';

const EntityDescription = {
  fields: [
    {
      name: 'date',
      type: Fields.DATEONLY,
    },
    {
      name: 'entity',
      type: Fields.STRING,
    },
    {
      name: 'description',
      type: Fields.TEXT,
    },
  ],
};

export const packageName = 'katejs-docs';
export const structures = {
  EntityDescription,
};
