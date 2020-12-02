import { Elements } from 'katejs/lib/client';

export default Form => class FileItem extends Form {
  constructor(args) {
    super(args);
    this.elements.set('fileName', {
      ...this.elements.get('fileName'),
      hidden: true,
    });
    this.elements.push({
      type: Elements.GRID,
      elements: [
        {
          cols: 8,
          type: Elements.GROUP,
          elements: [
            this.elements.cut('title'),
            {
              type: Elements.GRID,
              elements: [
                {
                  id: 'file',
                  type: Elements.INPUT,
                  inputType: 'file',
                  cols: 8,
                },
                {
                  id: 'upload',
                  title: 'Upload',
                  type: Elements.BUTTON,
                  onClick: () => this.upload(),
                  cols: 4,
                },
              ],
            },
          ],
        },
        {
          type: Elements.IMAGE,
          id: 'image',
          style: { width: '100%' },
        }
      ],
    }
);
  }
  afterInit() {
    super.afterInit();
    if (!this.uuid) {
      this.setPreview();
    }
  }
  async upload() {
    const files = this.content.file.files;
    if (!files || !files.length) {
      return;
    }
    this.content.title.value = files[0].name;
    this.content.fileName.value = files[0].name;
    await this.save();
    const fd = new FormData();
    fd.append('fileData', this.content.file.files[0]);
    fd.append('uuid', this.uuid);
    await this.app.File.upload(fd);
    this.setPreview();
  }
  async load() {
    const res = await super.load();
    this.setPreview();
    return res;
  }
  setPreview() {
    this.content.image.src = this.app.getFileUrl(this.uuid, this.content.fileName.value);
    if (!this.content.fileName.value) {
      this.content.image.hidden = true;
    }
  }
}
