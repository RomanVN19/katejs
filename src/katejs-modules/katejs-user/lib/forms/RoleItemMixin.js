import { Elements } from 'katejs/lib/client';
import { packageName } from '../structure';

const RoleItemMixin = parent => class RoleItem extends parent {
  constructor(sys, params) {
    super(sys, params);
    const card = this.elements.get('rightsCard');
    card.title = 'Entity access rights';
    const actions = card.elements.find(item => item.type === Elements.CARD_ACTIONS);
    actions.elements.push({
      id: 'fillButton',
      type: Elements.BUTTON,
      title: 'Fill',
      onClick: this.fill,
    });
    const table = card.elements.find(item => item.type === Elements.TABLE_EDITABLE);
    // table.columns[0].title = 'Entity';
    table.columns[2].title = 'Get';

    const cardMethods = this.elements.get('methodsCard');
    cardMethods.title = 'Custom rules/methods access rights';
    const actionsMethods = cardMethods.elements.find(item => item.type === Elements.CARD_ACTIONS);
    actionsMethods.elements.push({
      id: 'fillButton',
      type: Elements.BUTTON,
      title: 'Fill',
      onClick: this.fillMethods,
    });
    const tableMethods = cardMethods.elements.find(item => item.type === Elements.TABLE_EDITABLE);
    tableMethods.columns[1].title = 'Entity / Rule set';
    tableMethods.columns[2].title = 'Method / Rule';
  }
  fill = async () => {
    const { response: entities } = await this.app.User.getEntities();
    this.content.rights.value = entities.map(entity => ({
      entity,
      __get: true,
      put: true,
      query: true,
      delete: true,
    }));
  }
  fillMethods = async () => {
    const { response: methods } = await this.app.User.getMethods();
    this.content.methods.value = methods;
  }
};

RoleItemMixin.package = packageName;
export default RoleItemMixin;
