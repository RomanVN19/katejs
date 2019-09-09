
/*
Copyright © 2018 Roman Nep <neproman@gmail.com>

This file is part of KateJS.

KateJS is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

KateJS is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with KateJS.  If not, see <https://www.gnu.org/licenses/>.
*/

const Fields = {
  STRING: Symbol('string'),
  INTEGER: Symbol('integer'),
  REFERENCE: Symbol('reference'),
  DECIMAL: Symbol('decimal'),
  BOOLEAN: Symbol('boolean'),
  TEXT: Symbol('TEXT'),
  DATE: Symbol('DATE'),
  DATEONLY: Symbol('DATEONLY'),
  JSON: Symbol('JSON'),
};

export default Fields;
