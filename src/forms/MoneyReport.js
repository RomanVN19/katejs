import { Elements, Form } from 'katejs/lib/client';

export default class IncomeReport extends Form {
  constructor(args) {
    super(args);
    this.elements = [
      {
        type: Elements.LABEL,
        tag: 'h2',
        title: 'Money balance report',
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
            title: 'Wallet',
            dataPath: 'wallet.title',
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
    const { response: data } = await this.app.MoneyRecord.balance();
    this.content.data.value = data;
  }
}
