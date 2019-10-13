import { Elements, Form } from 'katejs/lib/client';

const dateStyle = { fontWeight: 'bold', fontSize: 'larger' };
const entityStyle = { fontWeight: 'bold' };
const contentStyle = { whiteSpace: 'pre-wrap' };

export default class WhatsNew extends Form {
  static title = 'What\'s new';
  constructor(args) {
    super(args);
    this.elements = [
      {
        id: 'byDates',
        type: Elements.GROUP,
        elements: [],
      },
    ];
    this.load();
  }
  async load() {
    const { response } = await this.app.EntityDescription.query({
      order: [['date', 'DESC'], ['entity']],
      limit: -1,
    });
    let data = this.app.docsContent;
    if (response) {
      data = this.app.docsContent.concat(response);
    }
    data.sort(({ date: b }, { date: a }) => (a > b ? 1 : (a < b ? -1 : 0)));
    const elements = [];
    let currentDate = '';
    let currentEntity = '';
    let currentContent = '';
    const addContent = () => {
      if (currentContent) {
        elements.push({
          type: Elements.LABEL,
          style: contentStyle,
          title: currentContent,
        });
      }
      currentContent = '';
    };
    let content;
    if (this.app.docsAccessFilter) {
      content = data.filter(item => this.app.docsAccessFilter(item));
    } else {
      content = data;
    }
    for (let index = 0; index < content.length; index += 1) {
      const element = content[index];
      if (currentDate !== element.date) {
        addContent();
        currentDate = element.date;
        elements.push({
          type: Elements.LABEL,
          style: dateStyle,
          title: element.date,
        });
      }
      if (currentEntity !== element.entity) {
        addContent();
        currentEntity = element.entity;
        elements.push({
          type: Elements.LABEL,
          style: entityStyle,
          title: element.entity,
        });
      }
      currentContent += `${element.description}\n`;
    }
    addContent();
    this.content.byDates.elements = elements;
  }
}
