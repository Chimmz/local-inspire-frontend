import React, { Fragment } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

type Props = {
  navBg?: string;
  children: React.ReactNode;
};

function Layout(props: Props) {
  return (
    <Fragment>
      <Navbar bg={props.navBg} />
      <main>
        {props.children}
        <Footer />
      </main>
    </Fragment>
  );
}

export default Layout;
