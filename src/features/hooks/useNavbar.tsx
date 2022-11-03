import { useEffect, useState } from 'react';

const useNavbar = () => {
  const [navbar, setNavbar] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setNavbar(document?.querySelector('nav'));
  }, []);

  const makeNavbarDark = () => navbar?.classList.add('nav-dark');
  const makeNavbarBgTransparent = () => {
    if (navbar) navbar.style.backgroundColor = 'transparent';
  };
  const positionNavbar = (val: 'absolute' | 'none') => {
    if (navbar) navbar.style.position = val;
  };

  return {
    navbar,
    makeNavbarDark,
    makeNavbarBgTransparent,
    positionNavbar,
  };
};

export default useNavbar;
