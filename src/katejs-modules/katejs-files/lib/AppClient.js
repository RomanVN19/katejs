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

const getImageTablePreviewFieldId = (index) => {
  return `imageTablePreviewElement_${index}`;
};

const applyFormLoad = (form) => {
  const formLoad = form.load;
  async function load() {
    const res = await formLoad.call(form);
    this.imagesFields.forEach((field, index) => {
      const fieldValue = this.content[field].value;
      if (fieldValue) {
        this.content[getImagePreviewFieldId(index)].src = form.app.getFileUrl(
          fieldValue.uuid,
          fieldValue.fileName,
        );
      } else {
        this.content[getImagePreviewFieldId(index)].src = '';
      }
      this.content[getImagePreviewFieldId(index)].hidden = !fieldValue;

      const fieldChange = form.content[field].onChange;
      form.content[field].onChange = (value) => {
        if (fieldChange) {
          fieldChange(value);
        }
        if (!value) {
          form.content[getImagePreviewFieldId(index)].src = '';
        } else {
          form.content[getImagePreviewFieldId(index)].src = form.app.getFileUrl(
            value.uuid,
            value.fileName,
          );
        }
        form.content[getImagePreviewFieldId(index)].hidden = !value;
      };
    });

    this.imageTableFields.forEach(({ imageField, tableId }, index) => {
      const rows = this.content[tableId].value;
      const rowsCount = (rows && rows.length) || 0;
      for (let i = 0; i < rowsCount; i++) {
        const row = this.content[tableId].getRow(i);
        if (row[imageField].value) {
          row[getImageTablePreviewFieldId(index)].value =  form.app.getFileUrl(
            row[imageField].value.uuid,
            row[imageField].value.fileName,
          );
        } else {
          row[getImageTablePreviewFieldId(index)].value = '';
        }
        row[getImageTablePreviewFieldId(index)].hidden = !row[imageField].value;
      }
    });

    return res;
  }
  form.load = load.bind(form);
};

AppClient.getImageElement = (imageField, form) => {
  if (!form.imagesFields) {
    form.imagesFields = [];
    form.imageTableFields = [];
    applyFormLoad(form);
  }
  const id = getImagePreviewFieldId(form.imagesFields.length);
  form.imagesFields.push(imageField);
  return {
    id,
    type: Elements.IMAGE,
    style: imageDefaultStyle,
  };
};

AppClient.getImageTableElement = (imageField, tableId, form) => {
  if (!form.imagesFields) {
    form.imagesFields = [];
    form.imageTableFields = [];
    applyFormLoad(form);
  }
  const id = getImageTablePreviewFieldId(form.imageTableFields.length);

  const table = form.elements.get(tableId);
  const imageColumn = table.columns.find(col => col.id === imageField);
  const onChange = imageColumn.onChange;
  imageColumn.onChange = (rowContent, colIndex) => {
    if (onChange) {
      onChange(rowContent, colIndex);
    }
    if (!rowContent[imageField].value) {
      rowContent[id].value = '';
    } else {
      rowContent[id].value =  form.app.getFileUrl(
        rowContent[imageField].value.uuid,
        rowContent[imageField].value.fileName,
      );
    }
    rowContent[id].hidden = !rowContent[imageField].value;
  };

  form.imageTableFields.push({
    imageField,
    tableId,
  });
  return {
    id,
    dataPath: id,
    type: Elements.IMAGE,
    style: imageDefaultStyle,
  };
};

AppClient.package = packageName;
export default AppClient;
