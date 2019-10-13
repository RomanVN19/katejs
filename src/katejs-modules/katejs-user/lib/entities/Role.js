import { Entity } from 'katejs';

import { structures } from '../structure';

class Role extends Entity {
  constructor(params) {
    super(params);
    this.structure = structures.Role;
  }
  async put(params) {
    const result = await super.put(params);
    if (result.response) {
      setTimeout(() => this.app.updateRoles(), 1000);
    }
    return result;
  }
}

export default Role;
