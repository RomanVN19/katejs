import { Elements } from 'katejs/lib/client';
import moment from 'moment';

const DocListForm = ItemForm => class DocList extends ItemForm {
  constructor(params) {
    super(params);

    const list = this.elements.get('list');
    list.columns.unshift({
      title: 'Title',
      dataPath: 'title',
    });
    // list.columns.unshift(
    //   {
    //     title: 'Number',
    //     dataPath: 'number',
    //   },
    //   {
    //     title: 'Date',
    //     dataPath: 'date',
    //     format: val => val && moment(val).format('DD.MM.YYYY HH:mm'),
    //   },
    // );
    this.elements.push({
      id: 'periodDialog',
      type: Elements.MODAL,
      maxWidth: 'md',
      noScroll: true,
      open: false,
      elements: [
        {
          type: Elements.MODAL_ACTIONS,
          elements: [
            {
              type: Elements.BUTTON,
              title: 'Apply',
              onClick: this.applyPeriodFilter,
            },
            {
              type: Elements.BUTTON,
              title: 'Cancel',
              onClick: this.closePeriodDialog,
            },
          ],
        },
        {
          type: Elements.GRID,
          elements: [
            {
              type: Elements.DATE,
              id: 'periodStart',
              title: 'Period start',
              timeFormat: false,
              cols: 6,
            },
            {
              type: Elements.DATE,
              id: 'periodEnd',
              title: 'Period end',
              timeFormat: false,
              cols: 6,
            },
          ],
        },
        {
          type: Elements.GRID,
          elements: [
            {
              type: Elements.BUTTON,
              title: 'Yesterday',
              fullWidth: true,
              cols: 4,
              onClick: () => this.setPeriod(-1, 'day'),
            },
            {
              type: Elements.BUTTON,
              title: 'Today',
              fullWidth: true,
              cols: 4,
              onClick: () => this.setPeriod(0, 'day'),
            },
            {
              type: Elements.BUTTON,
              title: 'Tomorrow',
              cols: 4,
              fullWidth: true,
              onClick: () => this.setPeriod(1, 'day'),
            },
          ],
        },
        {
          type: Elements.GRID,
          elements: [
            {
              type: Elements.BUTTON,
              title: 'Prev week',
              fullWidth: true,
              cols: 4,
              onClick: () => this.setPeriod(-1, 'week'),
            },
            {
              type: Elements.BUTTON,
              title: 'This week',
              fullWidth: true,
              cols: 4,
              onClick: () => this.setPeriod(0, 'week'),
            },
            {
              type: Elements.BUTTON,
              title: 'Next week',
              cols: 4,
              fullWidth: true,
              onClick: () => this.setPeriod(1, 'week'),
            },
          ],
        },
      ],
    });
    this.order = [['date', 'DESC']];
    this.filters = this.filters || {};
    if (this.app.docPeriodFilters[this.constructor.entity]) {
      this.filters.date = this.app.docPeriodFilters[this.constructor.entity];
    }
    this.actions.push({
      id: 'periodButton',
      type: Elements.BUTTON,
      title: this.filters && this.filters.date ? this.getActionPeriodTitle() : 'Period',
      onClick: this.openPeriodDialog,
    });
  }
  openPeriodDialog = () => {
    this.content.periodDialog.open = true;
  }
  closePeriodDialog = () => {
    this.content.periodDialog.open = false;
  }
  applyPeriodFilter = () => {
    const start = this.content.periodStart.value;
    const end = this.content.periodEnd.value;
    this.filters = this.filters || {};
    if (start || end) this.filters.date = {};
    if (start) {
      this.filters.date.$gte = moment(start).startOf('day').format();
    }
    if (end) {
      this.filters.date.$lte = moment(end).endOf('day').format();
    }
    this.load();
    this.closePeriodDialog();
    this.app.docPeriodFilters[this.constructor.entity] = this.filters.date;
    this.content.periodButton.title = this.getActionPeriodTitle();
  }
  setPeriod(delta, period) {
    this.content.periodStart.value = moment().add(delta, period).startOf(period);
    this.content.periodEnd.value = moment().add(delta, period).endOf(period);
  }
  getActionPeriodTitle() {
    return `${this.app.t('Period')} ${moment(this.filters.date.$gte).format('DD.MM')} - ${moment(this.filters.date.$lte).format('DD.MM')}`;
  }
};

export default DocListForm;
