import React, { Component, Fragment, ReactNode } from 'react';
import Navbar, { NavbarProps } from './navbar/Navbar';
import Footer from './Footer';
import cls from 'classnames';
import KeywordsNav from './navbar/CategoriesNav';

type LayoutProps = {
  navBg?: string;
  navbar?: boolean;
  children: React.ReactNode;
  // className?: string;
};

const Nav: React.FC<NavbarProps & { withKeywordsNav?: boolean }> = props => (
  <div className="position-relative">
    <Navbar {...props} />
    {props.withKeywordsNav ? <KeywordsNav /> : null}
    {props.children} {/* For rendering secondary navs*/}
  </div>
);

const Main = (props: {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) => (
  <main className={cls(props.className, 'flex-grow-1')} style={props.style} role="main">
    {props.children}
  </main>
);

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
