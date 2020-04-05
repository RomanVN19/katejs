# Модуль Settings
Модуль предназначен для хранения различных настроек для системы в целом
с возможностью их переопределения на уровне пользователя.

Поля настроек задаются в приложении в параметре settingsParams:

`AppServer.js`
````
  this.settingsParams = {
    fields: [
      {
        name: 'companyName',
        type: Fields.STRING,
      },
    ],
  };
````

`AppClient.js`
````
  this.settingsParams = {
    fields: [
      {
        name: 'companyName',
        type: Fields.STRING,
      },
    ],
  };
````

Структура `settingsParams` общая и для клиента и для сервера, 
поэтому можно ее вынести в общий файл (например `structure.js`)


Переопределение методов сущности `Settings` в `AppServer` следует выполнять в
методое `beforeInit`
````
const AppServer = parent => class Server extends use(parent, AppService) {
  ...

  beforeInit() {
    super.beforeInit();
    this.entities.Settings = SettingsMixin(this.entities.Settings);
  }
}
````
