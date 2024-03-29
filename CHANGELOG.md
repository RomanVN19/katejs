# Changelog

## 0.6.5 (23.05.2019)
- Full logo ability
- `katejs-user`: 1.5.4
  - hide tokens on query request

## 0.6.7 (24.05.2019)
- Styling menu drawer

## 0.7.0 (17.06.2019)
- Sequelize update to 6.0
- Added constraint key alias to fix long key error

## 0.7.1 (24.06.2019)
- Styling drawer fix
- Responsive tables

## 0.7.3 (18.07.2019)
- Updated dependencies

## 1.0.23 (18.07.2019)
- Lots small fixies
- changed files structure and export

## 1.0.26 (26.10.2019)
- tabs flex wrap + onTabChage 
- user client allow true if no users
- prevent data loose on sqlite dbsync

## 1.1.0
- fix checkbox normal/disabled labels font
- updated dependencies

## 1.1.2
- print styles
- submenu icons fix

## 1.1.3
- return on same page in lists

## 1.1.4
- rm console, up desc

# 1.1.8
- client app await afterInit
- client app use redux logger
- keep search on refresh

# 1.1.9
- skipForForm for entity
- set url on new item save
- elements.cut
- refactor ItemForm

# 1.1.10
- IMAGE element use `value` as src

# 1.1.11
- SELECT update options from .content

# 1.1.14
- rm webpack dep

# 1.1.17
- fix menu icon shrink
- fix menu render
- delete tables on entity delete
- for sqlite - no FK check

# 1.1.20
- AppServer.rawQuery(query: string): { response, error }
- afterInit after layout init
- fix menu re-set

# 1.1.21
- sqlite title search hack

# 1.1.22
- input reasonly select element
- modal style fix, no title fix

# 1.1.25
- rm unnecessary process exit on dbsync
- adjust modal zindex
- expose modelGetOptions

# 1.1.29
- `noTables`,`apartTables` options in Entity.query
- load tables apart in Entity.get
- List form use `noTables` options in query by default
- form close history.back option
- export terms from server 
