import { use, Elements } from 'katejs/lib/client';

import { structures, title, packageName } from './structure';
import FileItem from './forms/FileItem';

const imageDefaultStyle = {
  width: '100%',
};

const AppClient = parent => class Client extends use(parent) {
  static title = title;
  constructor(params) {
    super(params);

    this.init({ structures, addToMenu: true });

    this.forms = {
      ...this.forms,
      FileItem: FileItem(this.forms.FileItem),
    };
  }
  getFileUrl(uuid, fileName) {
    return `${this.baseUrl}/file/${uuid}/${fileName}?date=${new Date().getTime()}`;
  };
};

const getImagePreviewFieldId = (index) => {
  return `imagePreviewElement_${index}`;
};

AppClient.getImageElement = (imageField, form) => {
  if (!form.imagesFields) {
    form.imagesFields = [];

    const formLoad = form.load;
    async function load() {
      const res = await formLoad.call(form);
      this.imagesFields.forEach((field, index) => {
        const fieldValue = this.content[field].value;
        this.content[getImagePreviewFieldId(index)].src = form.app.getFileUrl(
          fieldValue.uuid,
          fieldValue.fileName,
        );

        const fieldChange = form.content[field].onChange;
        form.content[field].onChange = (value) => {
          if (fieldChange) {
            fieldChange(value);
          }
          form.content[getImagePreviewFieldId(index)].src = form.app.getFileUrl(
            value.uuid,
            value.fileName,
          );
        };
      });

      return res;
    }
    form.load = load.bind(form);
  }
  const id = getImagePreviewFieldId(form.imagesFields.length);
  form.imagesFields.push(imageField);
  return {
    id,
    type: Elements.IMAGE,
    style: imageDefaultStyle,
  };
};
AppClient.package = packageName;
export default AppClient;
