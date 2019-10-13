import { Elements } from 'katejs/lib/client';
import { packageName } from '../structure';

const UserItemMixin = parent => class UserItem extends parent {
  constructor(sys, params) {
    super(sys, params);

    const additionalElements = [
      {
        id: 'password1',
        title: 'Password',
        type: Elements.INPUT,
        onChange: this.checkPasswords,
        inputType: 'password',
        error: false,
        success: false,
      },
      {
        id: 'password2',
        title: 'Confirm password',
        type: Elements.INPUT,
        onChange: this.checkPasswords,
        inputType: 'password',
        error: false,
        success: false,
      },
      {
        id: 'passwordsMatch',
        type: Elements.LABEL,
        title: 'Passwords match',
      },
    ];
    this.elements.push(...additionalElements);
  }
  checkPasswords = () => {
    if (this.content.password1.value === this.content.password2.value) {
      this.content.passwordsMatch.title = 'Passwords match';
      this.content.password1.error = false;
      this.content.password2.error = false;
      this.content.password1.success = true;
      this.content.password2.success = true;
      this.content.__OK.disabled = false;
      this.content.__Save.disabled = false;
    } else {
      this.content.passwordsMatch.title = 'Passwords do not match';
      this.content.password1.error = true;
      this.content.password2.error = true;
      this.content.__OK.disabled = true;
      this.content.__Save.disabled = true;
    }
  }
};

UserItemMixin.package = packageName;
export default UserItemMixin;
