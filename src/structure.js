import Fields from 'katejs/lib/fields';

const Wallet = {
  fields: [
    {
      name: 'title',
      type: Fields.STRING,
    },
  ],
  skipForForm: true,
};

const IncomeArticle = {
  fields: [
    {
      name: 'title',
      type: Fields.STRING,
    },
  ],
};
const ExpenseArticle = {
  fields: [
    {
      name: 'title',
      type: Fields.STRING,
    },
  ],
};

const Income = {
  fields: [
    {
      name: 'wallet',
      type: Fields.REFERENCE,
      entity: 'Wallet',
    },
    {
      name: 'article',
      type: Fields.REFERENCE,
      entity: 'IncomeArticle',
    },
    {
      name: 'sum',
      type: Fields.DECIMAL,
    },
  ],
};

const Expense = {
  fields: [
    {
      name: 'wallet',
      type: Fields.REFERENCE,
      entity: 'Wallet',
    },
    {
      name: 'total',
      type: Fields.DECIMAL,
    },
    {
      name: 'image1',
      type: Fields.REFERENCE,
      entity: 'File',
      attributes: ['title', 'uuid', 'fileName'],
    },
    {
      name: 'image2',
      type: Fields.REFERENCE,
      entity: 'File',
      attributes: ['title', 'uuid', 'fileName'],
    },
  ],
  tables: [
    {
      name: 'images',
      fields: [
        {
          name: 'image',
          type: Fields.REFERENCE,
          entity: 'File',
          attributes: ['title', 'uuid', 'fileName'],
        },
      ],
    },
    {
      name: 'expensesDetails',
      fields: [
        {
          name: 'article',
          type: Fields.REFERENCE,
          entity: 'ExpenseArticle',
        },
        {
          name: 'sum',
          type: Fields.DECIMAL,
        },
      ],
    },
  ],
};

const MoneyRecord = {
  fields: [
    {
      name: 'wallet',
      type: Fields.REFERENCE,
      entity: 'Wallet',
    },
  ],
  resources: [
    {
      name: 'sum',
      type: Fields.DECIMAL,
    },
  ],
};

export const Settings = {
  fields: [
    {
      name: 'companyName',
      type: Fields.STRING,
    },
  ],
};

export const title = 'Tutorial app';
export const packageName = 'tutorial_app';
export const structures = {
  MoneyRecord,
  IncomeArticle,
  ExpenseArticle,
  Wallet,
  Income,
  Expense,
};
