/* global localStorage */
import { Elements, Form } from 'katejs/lib/client';
import { packageName } from '../structure';

export const linkStyle = {
  textDecoration: 'underline',
  cursor: 'pointer',
};
const errorStyle = {
  color: '#ff0000',
};

class Auth extends Form {
  constructor(sys) {
    super(sys);
    this.app.skipAuthorization = true; // to avoid redirect to Auth and clear params

    const elements = [
      {
        id: 'caption',
        type: Elements.LABEL,
        tag: 'h3',
        title: 'Auth',
        style: { textAlign: 'center' },
      },
      {
        id: 'username',
        type: Elements.INPUT,
        title: (this.app.userAuthorization || {}).usernameTitle || 'Username',
        onChange: this.clearErrors,
        error: false,
        value: '',
      },
      {
        id: 'password',
        type: Elements.INPUT,
        title: 'Password',
        inputType: 'password',
        onChange: this.clearErrors,
        error: false,
        value: '',
        onKeyPress: this.checkEnter,
      },
      {
        id: 'errorMessage',
        type: Elements.LABEL,
        title: '',
        hidden: true,
        style: errorStyle,
      },
      {
        id: 'login',
        type: Elements.BUTTON,
        title: 'Login',
        fullWidth: true,
        onClick: this.login,
      },
      {
        type: Elements.LABEL,
        title: 'Forgot your password?',
        onClick: this.gotoRecovery,
        style: linkStyle,
      },
      {
        id: 'registration',
        type: Elements.BUTTON,
        title: 'Registration',
        fullWidth: true,
        onClick: this.registration,
        hidden: !this.app.userRegistration,
      },
    ];

    const recoveryElements = [
      {
        id: 'caption',
        type: Elements.LABEL,
        tag: 'h3',
        title: 'Password recovery',
        style: { textAlign: 'center' },
      },
      {
        id: 'usernameRecovery',
        type: Elements.INPUT,
        title: (this.app.userAuthorization || {}).usernameTitle || 'Username',
        onChange: this.clearErrors,
        error: false,
        value: '',
      },
      {
        id: 'errorMessageRecovery',
        type: Elements.LABEL,
        title: '',
        hidden: true,
        style: errorStyle,
      },
      {
        id: 'successMessageRecovery',
        type: Elements.LABEL,
        title: 'Recovery instructions have been sent to your email!',
        hidden: true,
      },
      {
        id: 'recover',
        type: Elements.BUTTON,
        title: 'Recover password',
        fullWidth: true,
        disabled: false,
        onClick: this.recover,
      },
      {
        type: Elements.LABEL,
        title: 'Go to authorization',
        onClick: this.gotoAuth,
        style: linkStyle,
      },
    ];

    const { username, recovery } = sys.params;
    this.recovery = recovery;
    this.username = username;
    const resetElements = [
      {
        id: 'caption',
        type: Elements.LABEL,
        tag: 'h2',
        title: 'Password reset',
        style: { textAlign: 'center' },
      },
      {
        id: 'resetUser',
        type: Elements.LABEL,
        title: username,
      },
      {
        id: 'password1',
        title: 'Password',
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
        id: 'errorMessageReset',
        type: Elements.LABEL,
        title: '',
        hidden: true,
        style: errorStyle,
      },
      {
        id: 'successMessageReset',
        type: Elements.LABEL,
        title: 'Your password successfully reset!',
        hidden: true,
      },
      {
        id: 'resetPassword',
        type: Elements.BUTTON,
        title: 'Set new password',
        fullWidth: true,
        disabled: true,
        onClick: this.reset,
      },
      {
        type: Elements.LABEL,
        title: 'Go to authorization',
        onClick: this.gotoAuth,
        style: linkStyle,
      },
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
                id: 'auth',
                type: Elements.GROUP,
                elements,
                hidden: false,
              },
              {
                id: 'recovery',
                type: Elements.GROUP,
                elements: recoveryElements,
                hidden: true,
              },
              {
                id: 'reset',
                type: Elements.GROUP,
                elements: resetElements,
                hidden: true,
              },
            ],
          },
        ],
      },
    ];

    if (this.recovery) {
      this.elements.get('reset').hidden = false;
      this.elements.get('auth').hidden = true;
    }
    this.app.setDrawer(false);
  }
  clearErrors = () => {
    this.content.username.error = false;
    this.content.password.error = false;
    this.content.errorMessage.hidden = true;
    this.content.errorMessageRecovery.hidden = true;
  }
  checkEnter = (e) => {
    if (e.key === 'Enter') {
      this.login();
    }
  }
  login = async () => {
    this.app.authorizationDevice = localStorage.getItem(`${packageName}-device`);
    if (!this.app.authorizationDevice) {
      this.app.authorizationDevice = `device-${Math.ceil(Math.random() * 1000000)}`;
      localStorage.setItem(`${packageName}-device`, this.app.authorizationDevice);
    }
    const result = await this.app.User.auth({
      username: this.content.username.value,
      password: this.content.password.value,
      device: this.app.authorizationDevice,
    });
    if (result.response) {
      this.app.successAuth(result.response);
    } else {
      const { errorField: field, message } = result.error;
      if (field) {
        this.content[field].error = true;
      }
      if (message) {
        this.content.errorMessage.hidden = false;
        this.content.errorMessage.title = message;
      }
    }
  }
  gotoRecovery = () => {
    this.content.recovery.hidden = false;
    this.content.auth.hidden = true;
    this.content.reset.hidden = true;
  }
  gotoAuth = () => {
    this.content.recovery.hidden = true;
    this.content.reset.hidden = true;
    this.content.auth.hidden = false;
  }
  recover = async () => {
    this.content.recover.disabled = true;
    const url = `${window.location.protocol}//${window.location.host}`;
    const result =
      await this.app.User.passwordRecovery({ username: this.content.usernameRecovery.value, url });
    if (result.error) {
      this.content.errorMessageRecovery.title = result.error.message;
      this.content.errorMessageRecovery.hidden = false;
      this.content.recover.disabled = false;
    } else {
      this.content.successMessageRecovery.hidden = false;
    }
  }
  checkEmpty(field, equalField) {
    if (!this.content[field].value || (equalField &&
      this.content[field].value !== this.content[equalField].value)) {
      this.content[field].error = true;
      this.content[field].success = false;
      return false;
    }
    this.content[field].error = false;
    this.content[field].success = true;
    return true;
  }
  validate = () => {
    let valid = true;
    valid = this.checkEmpty('password1', 'password2') ? valid : false;
    valid = this.checkEmpty('password2', 'password1') ? valid : false;
    this.content.resetPassword.disabled = !valid;
  }
  reset = async () => {
    this.content.resetPassword.disabled = true;
    const result = await this.app.User.passwordReset({
      recovery: this.recovery,
      username: this.username,
      password: this.content.password1.value,
    });
    if (result.error) {
      this.content.errorMessageReset.hidden = false;
      this.content.errorMessageReset.title = result.error.message;
      this.content.resetPassword.disabled = false;
      return;
    }
    this.content.successMessageReset.hidden = false;
  }
  registration = () => {
    this.app.open('Registration');
  }
}

export default Auth;
