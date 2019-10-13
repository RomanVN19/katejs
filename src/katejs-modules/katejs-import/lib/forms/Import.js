import { Form, Elements } from 'katejs/lib/client';

export default class ActionLogList extends Form {
  static title = 'Import';
  constructor(args) {
    super(args);

    this.elements = [
      {
        id: 'grid',
        type: Elements.GRID,
        elements: [
          {
            id: 'entity',
            title: 'Entity',
            type: Elements.INPUT,
            value: '',
            cols: 3,
          },
          {
            id: 'syncField',
            title: 'syncField',
            type: Elements.INPUT,
            value: '',
            cols: 3,
          },
          {
            id: 'file',
            title: 'File',
            type: Elements.INPUT,
            inputType: 'file',
            accept: '.csv',
            value: '',
            cols: 9,
          },
        ],
      },
      {
        id: 'log',
        title: '',
        type: Elements.LABEL,
        style: { whiteSpace: 'pre-wrap' },
        hidden: true,
      },
      {
        id: 'upload',
        title: 'Import',
        type: Elements.BUTTON,
        onClick: this.upload,
      },
    ];
  }
  /* global FormData */
  upload = async () => {
    this.content.log.title = '';
    const { files } = this.content.file;
    if (!files) return;
    const fd = new FormData();
    fd.append('file', files[0]);
    fd.append('entity', this.content.entity.value);
    fd.append('syncField', this.content.syncField.value);
    const { response, error } = await this.app.Import.import(fd);
    this.content.log.hidden = false;
    this.content.log.title = response ?
      `${response.message}\nCreated ${response.createdCount} items.`
      : error.message;
  }
}
