import React, { Component, Fragment, ReactNode } from 'react';
import Navbar, { NavbarProps } from './navbar/Navbar';
import Footer from './Footer';

type Props = {
  navBg?: string;
  navbar?: boolean;
  children: React.ReactNode;
};

const Nav: React.FC<NavbarProps> = props => (
  <>
    <Navbar
      bg={props.bg}
      defaultCategorySuggestions={[
        'Hotels and motels',
        'Restaurants',
        'Cabins Rentals',
        'Vacation Rentals',
        'Things to do',
        'Cruises',
      ]}
      lightLogo={props.lightLogo}
    />
    {props.children} {/* For rendering secondary navs*/}
  </>
);

const Main = (props: { children: ReactNode; className?: string }) => (
  <main className={props.className}>{props.children}</main>
);

class Layout extends Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  static Nav = Nav;
  static Main = Main;

  render() {
    const { props } = this;

    return (
      <>
        {props.children}
        {/* {props.navbar ? (
          <Navbar
            bg={props.navBg}
            defaultCategorySuggestions={[
              'Hotels and motels',
              'Restaurants',
              'Cabins Rentals',
              'Vacation Rentals',
              'Things to do',
              'Cruises',
            ]}
          />
        ) : null}
        <main>{props.children}</main> */}
        <Footer />
      </>
    );
  }
}

export default Layout;
