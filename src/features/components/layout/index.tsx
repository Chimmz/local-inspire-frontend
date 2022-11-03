import React, { Fragment } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

type Props = {
  navBg?: string;
  children: React.ReactNode;
};

function Layout(props: Props) {
  return (
    <>
      {/* <Navbar bg={props.navBg} /> */}
      <main>{props.children}</main>
      <Footer />
    </>
  );
}

export default Layout;
