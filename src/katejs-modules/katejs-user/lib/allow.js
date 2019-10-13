
const allow = ({ entity, method, user, userRoles }) => {
  // by default all entity methods allowed, exept get|put|query
  const { roles } = user || { roles: ['public'] };
  let requestedMethod = method;
  const requestedEntity = entity;
  const deny = true; // policy always DENY
  if (requestedMethod === 'get') requestedMethod = '__get';
  if (deny) {
    // deny policy
    let allowResult = false;
    for (let i = 0; i < roles.length; i += 1) {
      const role = userRoles[roles[i]];
      if (role) {
        const ruleRow = role.find(item => item.entity === requestedEntity);
        if (ruleRow) {
          allowResult = ruleRow[requestedMethod];
        }
      }
      if (allowResult) break;
    }
    return allowResult;
  }

  // allow policy
  let allowResult = true;
  for (let i = 0; i < roles.length; i += 1) {
    const role = userRoles[roles[i]];
    if (role) {
      const ruleRow = role.find(item => item.entity === requestedEntity);
      if (ruleRow) {
        allowResult = ruleRow[requestedMethod];
        if (allowResult === undefined) allowResult = true;
      }
    }
    if (!allowResult) break;
  }
  return allowResult;
};

export const getRole = ({ entity, method, userRoles }) => {
  // console.log('roles', userRoles);
  const roles = [];
  Object.keys(userRoles).forEach((roleId) => {
    const rights = userRoles[roleId];
    if (rights.find(right => right.entity === entity && right[method])) {
      roles.push(roleId);
    }
  });
  return roles;
};

export default allow;
