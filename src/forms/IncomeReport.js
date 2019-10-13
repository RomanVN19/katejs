import { Elements, Form } from 'katejs/lib/client';

export default class IncomeReport extends Form {
  constructor(args) {
    super(args);
    this.elements = [
      {
        type: Elements.LABEL,
        tag: 'h2',
        title: 'Income report',
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
            dataPath: 'article.title',
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
    const { response: data } = await this.app.Income.query({
      attributes: [
        [{ $func: { fn: 'SUM', col: 'sum' } }, 'sum'],
      ],
      group: [{ $col: 'article.uuid' }],
      limit: -1,
    });
    this.content.data.value = data;
  }
}
