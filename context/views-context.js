import React from 'react';

export const ViewContext = React.createContext({
    shares: 0,
    incrementShares: () => {}
});