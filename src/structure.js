import Fields from 'katejs/lib/fields';

const Wallet = {
  fields: [
    {
      name: 'title',
      type: Fields.STRING,
    },
  ],
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
  ],
  tables: [
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
