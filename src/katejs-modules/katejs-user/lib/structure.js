import Fields from 'katejs/lib/fields';

const User = {
  fields: [
    {
      name: 'title',
      type: Fields.STRING,
    },
    {
      name: 'username',
      type: Fields.STRING,
    },
    {
      name: 'passwordHash',
      type: Fields.STRING,
      skipForForm: true,
      skipForList: true,
    },
    {
      name: 'passwordRecovery',
      type: Fields.STRING,
      skipForForm: true,
      skipForList: true,
    },
    {
      name: 'inactive',
      type: Fields.BOOLEAN,
      skipForList: true,
    },
  ],
  tables: [
    {
      name: 'roles',
      fields: [
        {
          name: 'role',
          type: Fields.REFERENCE,
          entity: 'Role',
        },
      ],
    },
    {
      name: 'tokens',
      skipForForm: true,
      fields: [
        {
          name: 'device',
          type: Fields.STRING,
        },
        {
          name: 'token',
          type: Fields.TEXT,
        },
      ],
    },
  ],
};

const Role = {
  fields: [
    {
      name: 'title',
      type: Fields.STRING,
    },
  ],
  tables: [
    {
      name: 'rights',
      fields: [
        {
          name: 'entity',
          type: Fields.STRING,
        },
        {
          name: '__get', // 'get' - reserved sequelize method
          type: Fields.BOOLEAN,
        },
        {
          name: 'put',
          type: Fields.BOOLEAN,
        },
        {
          name: 'query',
          type: Fields.BOOLEAN,
        },
        {
          name: 'delete',
          type: Fields.BOOLEAN,
        },
      ],
    },
    {
      name: 'methods',
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
          name: 'access',
          type: Fields.BOOLEAN,
        },
      ],
    },
  ],
};

export const title = 'Users';
export const packageName = 'katejs-user';
export const structures = {
  User,
  Role,
};
