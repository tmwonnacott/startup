import React from 'react';

export const AccountContext = React.createContext({
  accountName: 'Guest',
  accountLoading: true,
  setAccountName: () => {},
});
