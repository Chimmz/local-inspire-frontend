import Image from 'next/image';
import Link from 'next/link';
import React, { useMemo } from 'react';
import useSignedInUser from '../../../hooks/useSignedInUser';
import { getFullName, NamedUser } from '../../../utils/user-utils';
import { sideLinks } from './config';
import SidebarDropdown, { MultiLinks, SideLink } from './SidebarDropdown';

interface Props {
  show: boolean;
  getStyle: (className: string) => string;
}

const AdminSidebar = function (props: Props) {
  const { getStyle } = props;
  const currentAdminUser = useSignedInUser();

  // const profileLink = useMemo(() => {
  //   console.log({currentAdminUser});
  //   if (!currentAdminUser) return '/';
  //   return genUserProfileUrl(
  //     currentAdminUser as { _id: string; firstName: string; lastName: string },
  //   );
  // }, [currentAdminUser]);

  return (
    <nav id="sidebar" className={getStyle(`sidebar ${props.show && 'toggled'}`)}>
      <Link href="/">
        <div className="my-4 ms-5 cursor-pointer">
          <Image
            src="/img/localinspire-logo-white.png"
            alt="Local Inspire Logo"
            width={120}
            height={24}
          />
        </div>
      </Link>
      <div className={getStyle('sidebar-content')}>
        <div className={getStyle('sidebar-user')}>
          <Image
            src={currentAdminUser.imgUrl!}
            width={50}
            height={50}
            style={{ borderRadius: '50%' }}
          />
          <div className={getStyle('fw-bold')}>
            {getFullName(currentAdminUser as NamedUser, { full: true })}
          </div>
        </div>

        <ul className={getStyle('sidebar-nav')}>
          <div className="mx-auto mb-5">Welcome back, {currentAdminUser.firstName}</div>

          {/* {sideLinks.map(links => (
            <SidebarDropdown links={links} getStyle={props.getStyle} />
          ))} */}

          <li className={getStyle('sidebar-item active')}>
            <a
              data-bs-target="#dashboards"
              data-bs-toggle="collapse"
              className={getStyle('sidebar-link')}
            >
              <i className="align-middle me-2 fas fa-fw fa-home"></i>{' '}
              <span className={getStyle('align-middle')}>Dashboards</span>
            </a>
          </li>
          <li className={getStyle('sidebar-item')}>
            <a
              data-bs-target="#pages"
              data-bs-toggle="collapse"
              className={getStyle('sidebar-link collapsed')}
            >
              <i className="align-middle me-2 fas fa-fw fa-file"></i>{' '}
              <span className={getStyle('align-middle')}>Users</span>
            </a>
            <ul
              id="pages"
              className={getStyle('sidebar-dropdown list-unstyled collapse ')}
              data-bs-parent="#sidebar"
            >
              <li className={getStyle('sidebar-item')}>
                <a className={getStyle('sidebar-link')} href="pages-settings.html">
                  Settings
                </a>
              </li>
              <li className={getStyle('sidebar-item')}>
                <a className={getStyle('sidebar-link')} href="pages-clients.html">
                  Clients{' '}
                  <span className={getStyle('sidebar-badge badge rounded-pill bg-primary')}>
                    New
                  </span>
                </a>
              </li>
              <li className={getStyle('sidebar-item')}>
                <a className={getStyle('sidebar-link')} href="pages-invoice.html">
                  Invoice
                </a>
              </li>
              <li className={getStyle('sidebar-item')}>
                <a className={getStyle('sidebar-link')} href="pages-pricing.html">
                  Pricing
                </a>
              </li>
              <li className={getStyle('sidebar-item')}>
                <a className={getStyle('sidebar-link')} href="pages-tasks.html">
                  Tasks
                </a>
              </li>
              <li className={getStyle('sidebar-item')}>
                <a className={getStyle('sidebar-link')} href="pages-chat.html">
                  Chat{' '}
                  <span className={getStyle('sidebar-badge badge rounded-pill bg-primary')}>
                    New
                  </span>
                </a>
              </li>
              <li className={getStyle('sidebar-item')}>
                <a className={getStyle('sidebar-link')} href="pages-blank.html">
                  Blank Page
                </a>
              </li>
            </ul>
          </li>
          <li className={getStyle('sidebar-item')}>
            <a
              data-bs-target="#auth"
              data-bs-toggle="collapse"
              className={getStyle('sidebar-link collapsed')}
            >
              <i className="align-middle me-2 fas fa-fw fa-sign-in-alt"></i>{' '}
              <span className={getStyle('align-middle')}>Reports</span>
            </a>
            <ul
              id="auth"
              className={getStyle('sidebar-dropdown list-unstyled collapse ')}
              data-bs-parent="#sidebar"
            >
              <li className={getStyle('sidebar-item')}>
                <a className={getStyle('sidebar-link')} href="pages-sign-in.html">
                  Sign In
                </a>
              </li>
              <li className={getStyle('sidebar-item')}>
                <a className={getStyle('sidebar-link')} href="pages-sign-up.html">
                  Sign Up
                </a>
              </li>
              <li className={getStyle('sidebar-item')}>
                <a className={getStyle('sidebar-link')} href="pages-reset-password.html">
                  Reset Password
                </a>
              </li>
              <li className={getStyle('sidebar-item')}>
                <a className={getStyle('sidebar-link')} href="pages-404.html">
                  404 Page
                </a>
              </li>
              <li className={getStyle('sidebar-item')}>
                <a className={getStyle('sidebar-link')} href="pages-500.html">
                  500 Page
                </a>
              </li>
            </ul>
          </li>
          <li className={getStyle('sidebar-header')}>Elements</li>
          <li className={getStyle('sidebar-item')}>
            <a
              data-bs-target="#ui"
              data-bs-toggle="collapse"
              className={getStyle('sidebar-link collapsed')}
            >
              <i className="align-middle me-2 fas fa-fw fa-flask"></i>{' '}
              <span className={getStyle('align-middle')}>Businesses</span>
            </a>
            <ul
              id="ui"
              className={getStyle('sidebar-dropdown list-unstyled collapse ')}
              data-bs-parent="#sidebar"
            >
              <li className={getStyle('sidebar-item')}>
                <a className={getStyle('sidebar-link')} href="ui-alerts.html">
                  Alerts
                </a>
              </li>
              <li className={getStyle('sidebar-item')}>
                <a className={getStyle('sidebar-link')} href="ui-buttons.html">
                  Buttons
                </a>
              </li>
              <li className={getStyle('sidebar-item')}>
                <a className={getStyle('sidebar-link')} href="ui-cards.html">
                  Cards
                </a>
              </li>
              <li className={getStyle('sidebar-item')}>
                <a className={getStyle('sidebar-link')} href="ui-general.html">
                  General
                </a>
              </li>
              <li className={getStyle('sidebar-item')}>
                <a className={getStyle('sidebar-link')} href="ui-grid.html">
                  Grid
                </a>
              </li>
              <li className={getStyle('sidebar-item')}>
                <a className={getStyle('sidebar-link')} href="ui-modals.html">
                  Modals
                </a>
              </li>
              <li className={getStyle('sidebar-item')}>
                <a className={getStyle('sidebar-link')} href="ui-offcanvas.html">
                  Offcanvas
                </a>
              </li>
              <li className={getStyle('sidebar-item')}>
                <a className={getStyle('sidebar-link')} href="ui-placeholders.html">
                  Placeholders
                </a>
              </li>
              <li className={getStyle('sidebar-item')}>
                <a className={getStyle('sidebar-link')} href="ui-notifications.html">
                  Notifications
                </a>
              </li>
              <li className={getStyle('sidebar-item')}>
                <a className={getStyle('sidebar-link')} href="ui-tabs.html">
                  Tabs
                </a>
              </li>
              <li className={getStyle('sidebar-item')}>
                <a className={getStyle('sidebar-link')} href="ui-typography.html">
                  Typography
                </a>
              </li>
            </ul>
          </li>
          <li className={getStyle('sidebar-item')}>
            <a
              data-bs-target="#charts"
              data-bs-toggle="collapse"
              className={getStyle('sidebar-link collapsed')}
            >
              <i className={getStyle('align-middle me-2 fas fa-fw fa-chart-pie')}></i>{' '}
              <span className={getStyle('align-middle')}>Billing</span>
              <span className={getStyle('sidebar-badge badge rounded-pill bg-primary')}>
                New
              </span>
            </a>
            <ul
              id="charts"
              className={getStyle('sidebar-dropdown list-unstyled collapse ')}
              data-bs-parent="#sidebar"
            >
              <li className={getStyle('sidebar-item')}>
                <a className={getStyle('sidebar-link')} href="charts-chartjs.html">
                  Chart.js
                </a>
              </li>
              <li className={getStyle('sidebar-item')}>
                <a className={getStyle('sidebar-link')} href="charts-apexcharts.html">
                  ApexCharts
                </a>
              </li>
            </ul>
          </li>
          <li className={getStyle('sidebar-item')}>
            <a
              data-bs-target="#forms"
              data-bs-toggle="collapse"
              className={getStyle('sidebar-link collapsed')}
            >
              <i className="align-middle me-2 fas fa-fw fa-check-square"></i>{' '}
              <span className={getStyle('align-middle')}>Questions</span>
            </a>
            <ul
              id="forms"
              className={getStyle('sidebar-dropdown list-unstyled collapse ')}
              data-bs-parent="#sidebar"
            >
              <li className={getStyle('sidebar-item')}>
                <a className={getStyle('sidebar-link')} href="forms-layouts.html">
                  Layouts
                </a>
              </li>
              <li className={getStyle('sidebar-item')}>
                <a className={getStyle('sidebar-link')} href="forms-basic-elements.html">
                  Basic Elements
                </a>
              </li>
              <li className={getStyle('sidebar-item')}>
                <a className={getStyle('sidebar-link')} href="forms-advanced-elements.html">
                  Advanced Elements
                </a>
              </li>
              <li className={getStyle('sidebar-item')}>
                <a className={getStyle('sidebar-link')} href="forms-floating-labels.html">
                  Floating Labels
                </a>
              </li>
              <li className={getStyle('sidebar-item')}>
                <a className={getStyle('sidebar-link')} href="forms-input-groups.html">
                  Input Groups
                </a>
              </li>
              <li className={getStyle('sidebar-item')}>
                <a className={getStyle('sidebar-link')} href="forms-editors.html">
                  Editors
                </a>
              </li>
              <li className={getStyle('sidebar-item')}>
                <a className={getStyle('sidebar-link')} href="forms-validation.html">
                  Validation
                </a>
              </li>
              <li className={getStyle('sidebar-item')}>
                <a className={getStyle('sidebar-link')} href="forms-wizard.html">
                  Wizard
                </a>
              </li>
            </ul>
          </li>
          <li className={getStyle('sidebar-item')}>
            <a className={getStyle('sidebar-link')} href="tables-bootstrap.html">
              <i className="align-middle me-2 fas fa-fw fa-list"></i>{' '}
              <span className={getStyle('align-middle')}>Reviews</span>
            </a>
          </li>
          <li className={getStyle('sidebar-item')}>
            <a
              data-bs-target="#datatables"
              data-bs-toggle="collapse"
              className={getStyle('sidebar-link collapsed')}
            >
              <i className="align-middle me-2 fas fa-fw fa-table"></i>{' '}
              <span className={getStyle('align-middle')}>Cities</span>
            </a>
            <ul
              id="datatables"
              className={getStyle('sidebar-dropdown list-unstyled collapse ')}
              data-bs-parent="#sidebar"
            >
              <li className={getStyle('sidebar-item')}>
                <a className={getStyle('sidebar-link')} href="tables-datatables-responsive.html">
                  Responsive Table
                </a>
              </li>
              <li className={getStyle('sidebar-item')}>
                <a className={getStyle('sidebar-link')} href="tables-datatables-buttons.html">
                  Table with Buttons
                </a>
              </li>
              <li className={getStyle('sidebar-item')}>
                <a
                  className={getStyle('sidebar-link')}
                  href="tables-datatables-column-search.html"
                >
                  Column Search
                </a>
              </li>
              <li className={getStyle('sidebar-item')}>
                <a
                  className={getStyle('sidebar-link')}
                  href="tables-datatables-fixed-header.html"
                >
                  Fixed Header
                </a>
              </li>
              <li className={getStyle('sidebar-item')}>
                <a className={getStyle('sidebar-link')} href="tables-datatables-multi.html">
                  Multi Selection
                </a>
              </li>
              <li className={getStyle('sidebar-item')}>
                <a className={getStyle('sidebar-link')} href="tables-datatables-ajax.html">
                  Ajax Sourced Data
                </a>
              </li>
            </ul>
          </li>
          <li className={getStyle('sidebar-item')}>
            <a
              data-bs-target="#icons"
              data-bs-toggle="collapse"
              className={getStyle('sidebar-link collapsed')}
            >
              <i className="align-middle me-2 fas fa-fw fa-heart"></i>{' '}
              <span className={getStyle('align-middle')}>Settings</span>
            </a>
            <ul
              id="icons"
              className={getStyle('sidebar-dropdown list-unstyled collapse ')}
              data-bs-parent="#sidebar"
            >
              <li className={getStyle('sidebar-item')}>
                <a className={getStyle('sidebar-link')} href="icons-feather.html">
                  Feather
                </a>
              </li>
              <li className={getStyle('sidebar-item')}>
                <a className={getStyle('sidebar-link')} href="icons-ion.html">
                  Ion Icons
                </a>
              </li>
              <li className={getStyle('sidebar-item')}>
                <a className={getStyle('sidebar-link')} href="icons-font-awesome.html">
                  Font Awesome
                </a>
              </li>
            </ul>
          </li>
          <li className={getStyle('sidebar-item')}>
            <a className={getStyle('sidebar-link')} href="calendar.html">
              <i className="align-middle me-2 far fa-fw fa-calendar-alt"></i>{' '}
              <span className={getStyle('align-middle')}>Calendar</span>
            </a>
          </li>
          <li className={getStyle('sidebar-item')}>
            <a
              data-bs-target="#maps"
              data-bs-toggle="collapse"
              className={getStyle('sidebar-link collapsed')}
            >
              <i className="align-middle me-2 fas fa-fw fa-map-marker-alt"></i>{' '}
              <span className={getStyle('align-middle')}>Maps</span>
            </a>
            <ul
              id="maps"
              className={getStyle('sidebar-dropdown list-unstyled collapse ')}
              data-bs-parent="#sidebar"
            >
              <li className={getStyle('sidebar-item')}>
                <a className={getStyle('sidebar-link')} href="maps-google.html">
                  Google Maps
                </a>
              </li>
              <li className={getStyle('sidebar-item')}>
                <a className={getStyle('sidebar-link')} href="maps-vector.html">
                  Vector Maps
                </a>
              </li>
            </ul>
          </li>
          <li className={getStyle('sidebar-header')}>Extras</li>
          <li className={getStyle('sidebar-item')}>
            <a
              data-bs-target="#documentation"
              data-bs-toggle="collapse"
              className={getStyle('sidebar-link collapsed')}
            >
              <i className="align-middle me-2 fas fa-fw fa-book"></i>{' '}
              <span className={getStyle('align-middle')}>Documentation</span>
            </a>
            <ul
              id="documentation"
              className={getStyle('sidebar-dropdown list-unstyled collapse ')}
              data-bs-parent="#sidebar"
            >
              <li className={getStyle('sidebar-item')}>
                <a className={getStyle('sidebar-link')} href="docs-getting-started.html">
                  Getting Started
                </a>
              </li>
              <li className={getStyle('sidebar-item')}>
                <a className={getStyle('sidebar-link')} href="docs-plugins.html">
                  Plugins
                </a>
              </li>
              <li className={getStyle('sidebar-item')}>
                <a className={getStyle('sidebar-link')} href="docs-changelog.html">
                  Changelog
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default AdminSidebar;
