import moment from 'moment';
import { ListForm, Elements } from 'katejs/lib/client';

import { structures } from '../structure';

const { ActionLog } = structures;

export default class ActionLogList extends ListForm({ ActionLog }, { addElements: true }) {
  static title = 'Logs';
  constructor(args) {
    super(args);

    const table = this.elements.get('list');
    table.columns = [
      {
        title: 'Date',
        dataPath: 'createdAt',
        format: date => moment(date).format('DD.MM.YYYY HH:mm'),
      },
      {
        title: 'Entity',
        dataPath: 'entity',
      },
      {
        title: 'Method',
        dataPath: 'method',
      },
      {
        title: 'Status',
        dataPath: 'status',
      },
      {
        title: 'User',
        dataPath: 'userTitle',
      },
      {
        title: 'Object',
        dataPath: 'objectTitle',
      },
    ];
    this.order = [['createdAt', 'DESC']];

    const filters = {
      type: Elements.GRID,
      elements: [
        {
          cols: 3,
          type: Elements.SELECT,
          title: 'User',
          getOptions: this.queryUsers,
          onChange: this.applyFilters,
          id: 'user',
        },
        {
          cols: 3,
          type: Elements.SELECT,
          title: 'Entity',
          onChange: this.applyFilters,
          getOptions: this.queryEntities,
          id: 'entity',
        },
        {
          cols: 2,
          type: Elements.DATE,
          title: 'Date from',
          onChange: this.applyFilters,
          id: 'dateFrom',
        },
        {
          cols: 2,
          type: Elements.DATE,
          title: 'Date to',
          onChange: this.applyFilters,
          id: 'dateTo',
        },
        {
          cols: 2,
          type: Elements.SELECT,
          title: 'Period',
          onChange: this.applyPeriod,
          id: 'period',
          options: [
            { title: 'Today', value: 1 },
            { title: 'Yesterday', value: 2 },
            { title: 'This week', value: 3 },
            { title: 'Prev. week', value: 4 },
          ],
        },
      ],
    };
    this.elements.unshift(filters);
    this.filters = {};
    this.fillEntities();
    if (this.app.apilogHighlight) {
      const methods = this.app.apilogHighlight;
      this.elements.get('list').cellStyle = (row) => {
        if (methods[row.entity] && methods[row.entity][row.method]) {
          return { backgroundColor: '#ff9999' };
        }
        return undefined;
      };
    }
  }
  async fillEntities() {
    const { response: entities } = await this.app.User.getEntities();
    this.entities = entities.map(e => ({ title: e, value: e }));
  }
  queryUsers = async (query) => {
    let res;
    if (query) {
      res = await this.app.User.query({
        where: {
          $or: [
            { title: { $like: `%${query}%` } },
            { username: { $like: `%${query}%` } },
          ],
        },
      });
    } else {
      res = await this.app.User.query();
    }
    return res.response.map(user => ({ title: `${user.title} (${user.username})`, value: user.uuid }));
  }
  queryEntities = (query) => {
    if (!query) return this.entities;
    return this.entities.query(item => item.title.toUpperCase().includes(query.toUpperCase()));
  }
  applyFilters = () => {
    const { user, entity, dateFrom, dateTo } = this.getValues();
    this.filters.userId = (user && user.value) || undefined;
    this.filters.entity = (entity && entity.value) || undefined;
    if (dateFrom || dateTo) {
      this.filters.createdAt = {};
      if (dateFrom) {
        this.filters.createdAt.$gte = dateFrom;
      }
      if (dateTo) {
        this.filters.createdAt.$lte = dateTo;
      }
    } else {
      delete this.filters.createdAt;
    }
    this.load();
  }
  applyPeriod = () => {
    const period = this.content.period.value;
    switch (period.value) {
      case 1:
        this.content.dateFrom.value = moment().startOf('day');
        this.content.dateTo.value = moment().endOf('day');
        break;
      case 2:
        this.content.dateFrom.value = moment().add(-1, 'day').startOf('day');
        this.content.dateTo.value = moment().add(-1, 'day').endOf('day');
        break;
      case 3:
        this.content.dateFrom.value = moment().startOf('week');
        this.content.dateTo.value = moment().endOf('week');
        break;
      case 4:
        this.content.dateFrom.value = moment().add(-1, 'week').startOf('week');
        this.content.dateTo.value = moment().add(-1, 'week').endOf('week');
        break;
      default:
        break;
    }
    this.applyFilters();
  }
}
