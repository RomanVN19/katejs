import { Elements, Form } from 'katejs/lib/client';

export default class ExpenseReport extends Form {
  constructor(args) {
    super(args);
    this.elements = [
      {
        type: Elements.LABEL,
        tag: 'h2',
        title: 'Expense report',
      },
      {
        id: 'startDate',
        type: Elements.DATE,
        title: 'Start date',
      },
      {
        id: 'endDate',
        type: Elements.DATE,
        title: 'End date',
      },
      {
        type: Elements.BUTTON,
        title: 'Form report',
        onClick: this.formReport,
      },
      {
        id: 'data',
        type: Elements.TABLE,
        columns: [
          {
            title: 'Article',
            dataPath: 'expensesDetails.article.title',
          },
          {
            title: 'Sum',
            dataPath: 'sum',
          },
        ],
      },
    ];
  }

  formReport = async () => {
    const { response: data } = await this.app.Expense.query({
      where: {
        date: {
          $gte: this.content.startDate.value,
          $lte: this.content.endDate.value,
        },
      },
      attributes: [
        [{ $func: { fn: 'SUM', col: 'sum' } }, 'sum'],
      ],
      group: [{ $col: 'expensesDetails->article.uuid' }],
      raw: true,
      limit: -1,
    });
    this.content.data.value = data;
  }
}
