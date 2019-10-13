import { Elements } from 'katejs/lib/client';

export default Form => class UserList extends Form {
  constructor(args) {
    super(args);
    const search = {
      type: Elements.GRID,
      elements: [
        {
          type: Elements.INPUT,
          id: 'search',
          title: 'Search (name or email)',
          cols: 4,
          onChange: this.searchChange,
        },
        {
          cols: 2,
          type: Elements.SELECT,
          id: 'active',
          title: 'Active',
          value: { title: this.app.t('All') },
          options: [
            { title: 'All', value: 0 },
            { title: 'Active', value: 1 },
            { title: 'Inactive', value: 2 },
          ],
          onChange: this.search,
          noClear: true,
        },
      ],
    };
    this.elements.unshift(search);
  }
  searchChange = () => {
    if (this.searchTimeout) clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(this.search, 400);
  }
  search = () => {
    const query = this.content.search.value;
    const active = this.content.active.value;
    if (!query) {
      this.filters = {};
    } else {
      this.filters = { $or: [
        { title: { $like: `%${query}%`} },
        { username: { $like: `%${query}%` } },
      ] };
    }
    if (active.value !== 0) {
      this.filters.inactive = active.value === 2;
    }
    this.load();
  }
};
