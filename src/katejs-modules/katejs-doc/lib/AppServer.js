import { use } from 'katejs';
import { packageName } from './structure';
import DocMixin from './entities/DocMixin';
import RecordMixin from './entities/RecordMixin';

const AppServer = parent => class Server extends use(parent) {
  beforeInit() {
    if (super.beforeInit) super.beforeInit();
    // add fields to docs
    Object.keys(this.entities).forEach((name) => {
      if (this.entities[name].doc) {
        this.entities[name] = DocMixin(this.entities[name]);
        this.entities[name].docName = name;
      }
    });
    Object.keys(this.entities).forEach((name) => {
      if (this.entities[name].record) {
        this.entities[name] = RecordMixin(this.entities[name]);
      }
    });
  }
};
AppServer.package = packageName;
export default AppServer;
