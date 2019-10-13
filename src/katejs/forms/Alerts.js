import { Form } from 'kate-client';
import { Elements } from 'kate-form-material-kit-react';

export const showAlert = Symbol('showAlert');

export default class Alerts extends Form {
  constructor(params) {
    super(params);
    this.app.showAlert = this.showAlert;
    this.elements = [{
      id: 'alerts',
      type: Elements.LayoutAlerts,
      elements: [],
    }];
  }
  showAlert = (alert) => {
    const { elements: alerts } = this.content.alerts;
    // eslint-disable-next-line no-param-reassign
    alert.timestamp = new Date().getTime() + ((alert.timeout || 2) * 1000);
    alerts.push(alert);
    this.content.alerts.elements = alerts;
    setTimeout(() => {
      const { elements: alertsToCheck } = this.content.alerts;
      const now = new Date().getTime();
      const newAlerts = alertsToCheck.filter(item => item.timestamp > now);
      this.content.alerts.elements = newAlerts;
    }, ((alert.timeout || 2) * 1000) + 100);
  }
}
