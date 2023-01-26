import React, { Component, Fragment, ReactNode } from 'react';
import Navbar, { NavbarProps } from './navbar/Navbar';
import Footer from './Footer';
import cls from 'classnames';

const Nav: React.FC<NavbarProps> = props => (
  <div className="position-relative">
    <Navbar bg={props.bg} lightLogo={props.lightLogo} />
    {props.children} {/* For rendering secondary navs*/}
  </div>
);

const Main = (props: { children: ReactNode; className?: string }) => (
  <main className={cls(props.className, 'flex-grow-1')}>{props.children}</main>
);

type LayoutProps = {
  navBg?: string;
  navbar?: boolean;
  children: React.ReactNode;
  // className?: string;
};

class Layout extends Component<LayoutProps> {
  constructor(props: LayoutProps) {
    super(props);
  }

  static Nav = Nav;
  static Main = Main;

  render() {
    const { props } = this;

    return (
      <>
        {props.children} <Footer />
      </>
    );
  }
}

export default Layout;
