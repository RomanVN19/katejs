import fs from 'fs';
import path from 'path';

export default Entity => class File extends Entity {
  async upload({ ctx, data }) {
    const { fileData } = ctx.request.files || {};
    await fs.promises.rename(fileData.path, path.join(this.app.filesUploadPath, data.uuid));
    return { response: 'ok' };
  }
}
