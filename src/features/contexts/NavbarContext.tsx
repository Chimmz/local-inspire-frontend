import React from 'react';

const NavbarContext = React.createContext();

type Props {
  children: React.ReactNode
}

const NavbarContextProvider: React.FC = (props: Props) => {
  return (
    <NavbarContext.Provider>{props.children}</NavbarContext.Provider>
  )
}