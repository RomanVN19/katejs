import { ItemForm, Elements } from 'katejs/lib/client';
import { structures } from '../structure';

const { ActionLog } = structures;

export default class ActionLogList extends ItemForm({ ActionLog }, { addElements: true }) {
  static title = 'Log entry';
  constructor(args) {
    super(args);
    this.actions = [
      {
        id: '__Close',
        type: Elements.BUTTON,
        title: 'Close',
        onClick: this.close,
        disabled: false,
      },
    ];
    // this.elements.get('data');
    this.elements.push({
      id: 'shallowDiff',
      type: Elements.TABLE,
      columns: [
        {
          title: 'Field',
          dataPath: 'field',
        },
        {
          title: 'Previous',
          dataPath: 'previous',
          format: val => ((typeof val === 'object' && val) ? val.title : val),
        },
        {
          title: 'Current',
          dataPath: 'current',
          format: val => ((typeof val === 'object' && val) ? val.title : val),
        },
      ],
      value: [],
      hidden: true,
    });
  }
  load = async () => {
    const log = await super.load();
    if (log.data) {
      try {
        const parsedData = JSON.parse(log.data);
        const prettyData = JSON.stringify(parsedData, null, 2);
        this.content.data.value = prettyData;
        if (parsedData.shallowDiff) {
          this.content.shallowDiff.value = parsedData.shallowDiff;
          this.content.shallowDiff.hidden = false;
          this.content.data.hidden = true;
        }
      // eslint-disable-next-line no-empty
      } catch (error) {
      }
    }
  }
  close = () => {
    this.app.open('ActionLogList');
  }
}
