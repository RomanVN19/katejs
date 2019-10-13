// eslint-disable-next-line import/no-extraneous-dependencies
import React from 'react';

const UserList = () => (
  <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="24" height="24" viewBox="0 0 24 24">
    <path d="M16,13C15.71,13 15.38,13 15.03,13.05C16.19,13.89 17,15 17,16.5V19H23V16.5C23,14.17 18.33,13 16,13M8,13C5.67,13 1,14.17 1,16.5V19H15V16.5C15,14.17 10.33,13 8,13M8,11A3,3 0 0,0 11,8A3,3 0 0,0 8,5A3,3 0 0,0 5,8A3,3 0 0,0 8,11M16,11A3,3 0 0,0 19,8A3,3 0 0,0 16,5A3,3 0 0,0 13,8A3,3 0 0,0 16,11Z" />
  </svg>
);

const RoleList = () => (
  <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="24" height="24" viewBox="0 0 24 24">
    <path d="M7.5,15C8.63,15 9.82,15.26 11.09,15.77C12.35,16.29 13,16.95 13,17.77V20H2V17.77C2,16.95 2.65,16.29 3.91,15.77C5.18,15.26 6.38,15 7.5,15M13,13H22V15H13V13M13,9H22V11H13V9M13,5H22V7H13V5M7.5,8A2.5,2.5 0 0,1 10,10.5A2.5,2.5 0 0,1 7.5,13A2.5,2.5 0 0,1 5,10.5A2.5,2.5 0 0,1 7.5,8Z" />
  </svg>
);

const Logout = () => (
  <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="24" height="24" viewBox="0 0 24 24">
    <path d="M16,17V14H9V10H16V7L21,12L16,17M14,2A2,2 0 0,1 16,4V6H14V4H5V20H14V18H16V20A2,2 0 0,1 14,22H5A2,2 0 0,1 3,20V4A2,2 0 0,1 5,2H14Z" />
  </svg>
);

const Profile = () => (
  <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="24" height="24" viewBox="0 0 24 24">
    <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
  </svg>
);

export default {
  RoleList,
  UserList,
  Logout,
  Profile,
};
