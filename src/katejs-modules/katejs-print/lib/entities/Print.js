import Handlebars from 'handlebars';

export default class Print {
  constructor(args) {
    Object.assign(this, args);
  }
  async print({ data }) {
    const { response: templates } = await this.app.PrintTemplate.query({ data: { where: {
      title: data.template,
    } } });
    if (!templates || !templates.length) {
      return { error: { status: 404, message: 'no template' } };
    }
    const [template] = templates;
    return { response: { data: Handlebars.compile(template.content)(data.data) } };
  }
}
