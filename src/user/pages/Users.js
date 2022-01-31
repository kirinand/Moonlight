import React from "react";

import UsersList from "../components/UsersList";

const Users = () => {
  const USERS = [
    {
      id: 'u1',
      name: 'Kirin Tang',
      image:
        'https://dummyimage.com/600x400/000/fff',
      events: 3
    }
  ];

  return <UsersList items={USERS} />;
};

export default Users;