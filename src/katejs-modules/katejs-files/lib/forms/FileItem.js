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
          id: 'file',
          type: Elements.INPUT,
          inputType: 'file',
        },
        {
          id: 'upload',
          title: 'Upload',
          type: Elements.BUTTON,
          onClick: () => this.upload(),
        },
      ],
    });
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
    const { error } = await this.app.File.upload(fd);
  }
}
