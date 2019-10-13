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
