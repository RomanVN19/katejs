import Fields from 'katejs/lib/fields';

const File = {
  fields: [
    {
      name: 'title',
      type: Fields.STRING,
    },
    {
      name: 'fileName',
      type: Fields.STRING,
    }
  ],
};

export const title = 'Files';
export const packageName = 'katejs-files';
export const structures = {
  File,
};
