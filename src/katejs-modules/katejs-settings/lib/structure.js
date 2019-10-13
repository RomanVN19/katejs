import Fields from 'katejs/lib/fields';

const Settings = {
  fields: [
    {
      name: 'user',
      type: Fields.REFERENCE,
      entity: 'User',
    },
    {
      name: 'date',
      type: Fields.DATE,
    },
  ],
};

export const structures = {
  Settings,
};

export const packageName = 'katejs-settings';
