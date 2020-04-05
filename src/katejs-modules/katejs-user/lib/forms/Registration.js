import { Elements, Form } from 'katejs/lib/client';

import { getLoader, linkStyle } from './Auth';

const successText = 'Your account has been created.';

export default class Register extends Form {
  constructor(args) {
    super(args);
    this.app.skipAuthorization = true; // to avoid redirect to Auth

    const elements = [
      ...(this.app.userRegistration.fields || []),
      {
        id: 'name',
        type: Elements.INPUT,
        title: 'Your name',
        onChange: this.validate,
        error: false,
        success: false,
      },
      {
        id: 'email',
        type: Elements.INPUT,
        title: 'E-mail',
        onChange: this.validate,
        error: false,
        success: false,
      },
      {
        id: 'password1',
        title: this.app.userRegistration.passwordTitle || 'Password',
        type: Elements.INPUT,
        onChange: this.validate,
        inputType: 'password',
        error: false,
        success: false,
      },
      {
        id: 'password2',
        title: 'Confirm password',
        type: Elements.INPUT,
        onChange: this.validate,
        inputType: 'password',
        error: false,
        success: false,
      },
      {
        id: 'errorMessage',
        type: Elements.LABEL,
        title: '',
        hidden: true,
      },
      {
        id: 'register',
        title: 'Register',
        type: Elements.BUTTON,
        onClick: () => this.register(),
        fullWidth: true,
      },
      getLoader(),
    ];
    this.elements = [
      {
        id: 'grid',
        type: Elements.GRID,
        elements: [
          { type: Elements.LABEL, cols: 4 },
          {
            type: Elements.GROUP,
            elements: [
              {
                title: 'Registration',
                type: Elements.LABEL,
                tag: 'h3',
              },
              {
                id: 'mainGroup',
                type: Elements.GROUP,
                elements,
                hidden: false,
              },
              {
                id: 'successText',
                type: Elements.LABEL,
                // eslint-disable-next-line max-len
                title: (this.app.userRegistration && this.app.userRegistration.registrationText) || successText,
                hidden: true,
              },
              {
                type: Elements.LABEL,
                title: 'Go to authorization',
                onClick: this.gotoAuth,
                style: linkStyle,
              },
            ],
            cols: 4,
          },
        ],
      },
    ];
    this.app.setDrawer(false);
  }
  afterInit() {
    this.validate();
  }
  checkEmpty(field, equalField, valid) {
    if (!this.content[field].value
      || (equalField && this.content[field].value !== this.content[equalField].value)
      || (valid && !valid(this.content[field].value))) {
      this.content[field].error = true;
      this.content[field].success = false;
      return false;
    }
    this.content[field].error = false;
    this.content[field].success = true;
    return true;
  }
  validateForm() {
    this.content.errorMessage.hidden = true;
    let valid = true;
    valid = this.checkEmpty('name') ? valid : false;
    valid = this.checkEmpty('email') ? valid : false;
    valid = this.checkEmpty('password1', 'password2', this.app.userRegistration.passwordValid) ? valid : false;
    valid = this.checkEmpty('password2', 'password1', this.app.userRegistration.passwordValid) ? valid : false;
    return valid;
  }
  validate = () => {
    const valid = this.validateForm();
    this.content.register.disabled = !valid;
  }
  async register() {
    this.content.register.hidden = true;
    this.content.loading.hidden = false;
    const data = {
      ...this.getValues(),
      url: `${window.location.protocol}//${window.location.host}${this.app.constructor.path}`,
    };
    const { error } = await this.app.User.register(data);
    if (error) {
      this.content.errorMessage.title = error.message;
      this.content.errorMessage.hidden = false;
    } else {
      this.content.successText.hidden = false;
      this.content.mainGroup.hidden = true;
    }
    this.content.register.hidden = false;
    this.content.loading.hidden = true;
  }
  gotoAuth = () => {
    this.app.open('Auth');
  }
}
