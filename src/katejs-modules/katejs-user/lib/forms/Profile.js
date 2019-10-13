import { Elements, Form } from 'katejs/lib/client';

export default class Profile extends Form {
  static title = 'Profile';

  constructor(args) {
    super(args);

    this.actions = [
      {
        id: '__Save',
        type: Elements.BUTTON,
        title: 'Save',
        onClick: this.save,
      },
    ];

    this.elements = [
      {
        id: 'username',
        title: 'Your email (username)',
        type: Elements.LABEL,
      },
      {
        id: 'title',
        title: 'Name',
        type: Elements.INPUT,
        value: '',
      },
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
    this.load();
  }

  checkPasswords = () => {
    if (this.content.password1.value === this.content.password2.value) {
      this.content.passwordsMatch.title = 'Passwords match';
      this.content.password1.error = false;
      this.content.password2.error = false;
      this.content.password1.success = true;
      this.content.password2.success = true;
      this.content.__Save.disabled = false;
    } else {
      this.content.passwordsMatch.title = 'Passwords do not match';
      this.content.password1.error = true;
      this.content.password2.error = true;
      this.content.__Save.disabled = true;
    }
  }

  async load() {
    const { response } = await this.app.User.profile();
    this.setValues(response);
    this.content.username.title = `${this.app.t('Your email (username)')}: ${response.username}`;
  }

  save = async () => {
    const profile = this.getValues();
    await this.app.User.profile({ profile });
  }
}
