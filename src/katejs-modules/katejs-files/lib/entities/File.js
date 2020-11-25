
export default Entity => class File extends Entity {
  async upload({ ctx, data }) {
    const { fileData } = ctx.request.files || {};
    console.log('UPLOAD', fileData.path, process.cwd(), data);
  }
}
