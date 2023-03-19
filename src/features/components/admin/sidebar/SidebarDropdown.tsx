import Link from 'next/link';
import React, { ReactNode, useMemo } from 'react';
import useToggle from '../../../hooks/useToggle';

export interface SideLink {
  label: string;
  href: string;
}

export interface MultiLinks extends SideLink {
  subLinks: SideLink[];
}

interface Props {
  links: SideLink | MultiLinks;
  getStyle: (className: string) => string;
}

const SidebarDropdown = (props: Props) => {
  const { getStyle } = props;
  const { state: expanded, toggle: toggleDropdown } = useToggle();

  const parentLink: ReactNode = useMemo(() => {
    const parentProps = {
      className: getStyle(`sidebar-link ${!expanded && 'collapsed'}`),
      'data-bs-toggle': 'collapse',
      onClick: toggleDropdown,
    };
    const parentContent = (
      <>
        <i className="align-middle me-2 fas fa-fw fa-home"></i>{' '}
        <span className={getStyle('align-middle')}>{props.links.label}</span>
      </>
    );

    const isDropdown = 'subLinks' in props.links;
    if (isDropdown) return <span {...parentProps}>{parentContent}</span>;

    return (
      <Link href={props.links.href}>
        <a
          // data-bs-target="#dashboards"
          data-bs-toggle="collapse"
          className={getStyle(`sidebar-link ${!expanded && 'collapsed'}`)}
          onClick={toggleDropdown}
        >
          {}
        </a>
      </Link>
    );
  }, []);

  return (
    <li className={getStyle(`sidebar-item ${expanded && 'active'}`)}>
      {parentLink}
      {/* <Link href={props.links.href}>
        <a
          // data-bs-target="#dashboards"
          data-bs-toggle="collapse"
          className={getStyle(`sidebar-link ${!expanded && 'collapsed'}`)}
          onClick={toggleDropdown}
        >
          <i className="align-middle me-2 fas fa-fw fa-home"></i>{' '}
          <span className={getStyle('align-middle')}>{props.links.label}</span>
        </a>
      </Link> */}

      <ul
        id="dashboards"
        className={getStyle(`sidebar-dropdown list-unstyled collapse ${expanded && 'show'}`)}
        data-bs-parent="#sidebar"
      >
        {'subLinks' in props.links
          ? props.links.subLinks.map(l => (
              <li className={getStyle('sidebar-item active')}>
                <Link href={l.href} className={getStyle('sidebar-link')}>
                  {l.label}
                </Link>
              </li>
            ))
          : null}
      </ul>
    </li>
  );
};

export default SidebarDropdown;
