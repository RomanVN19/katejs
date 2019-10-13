# katejs-doc - модуль для документов и движений.

- Каждый документ имеет поля
  - number, date, title
  - title устанавливается при записи автоматически

## Создание документов.

Для добавления функцональности документа в класс сущности должен иметь поле `doc` = `true`;

- `AppServer.js`
````
  this.entities.Payment.doc = true;
````
Или
- `entitied/Payment.js`
````
export default class Payment extends Entity {
  static doc = true;

  ...
}
````
- `AppClient.js`
````
    this.forms.PaymentList.doc = true;
    this.forms.PaymentItem.doc = true;
````

## Создание регистров

Модуль предоставляет возможность создания регистров учета. Регистры учета полезны, когда по какому либо разделу учета делают движения разные документы - единый регистр позволяет формировать расчетные отчеты не перебирая разные документы.

- Запись в регистр имеет следующие системные поля:
  - docUuid - иденитфикатор документа,
  - entity - имя сущности - документа, 
  - docTitle - представление документа.

Объявление регистра 

`structure.js`
````
const DebtRecord = {
  skipForForm: true,
  fields: [
    fields.client,
  ],
  resources: [
    fields.sum,
  ],
};
````
`AppServer.js`
````
  this.entities.DebtRecord.record = true;
````
Указание в документе признака использования регистра
````
export default class Payment extends Entity {
  static doc = true;
  static records = ['DebtRecord'];

  ...
}
````
Формирование движений

`entities/Payment.js`
````
  makeRecords(doc) {
    const records = [];
    (doc.clients || []).forEach((row) => {
      records.push({
        client: row.client,
        sum: -row.sum,
      });
    });
    return {
      DebtRecord: records.filter(item => !!item.sum),
    };
  }

````