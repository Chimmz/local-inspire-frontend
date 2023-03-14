import React, { useMemo } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import { NextAuthOptions, unstable_getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]';
import cls from 'classnames';
import styles from '../../styles/sass/pages/AdminPage.module.css';
import Image from 'next/image';
import useSignedInUser from '../../features/hooks/useSignedInUser';
import { getFullName, NamedUser } from '../../features/utils/user-utils';
import api from '../../features/library/api';
import { PrivateMessage } from '../../features/types';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { quantitize } from '../../features/utils/quantity-utils';

interface AdminPageProps {
  messages: PrivateMessage[] | undefined;
}

const getStyle = (className: string) => {
  return cls(...className.split(' ').map(word => styles[word]));
};

const AdminPage: NextPage<AdminPageProps> = function (props) {
  const adminUser = useSignedInUser();

  return (
    <div className={getStyle('wrapper')}>
      <nav id="sidebar" className={getStyle('sidebar')}>
        <Link href="/">
          <div className="my-4 ms-5 cursor-pointer">
            <Image
              src="/img/localinspire-logo-white.png"
              alt="Local Inspire Logo"
              width={120}
              height={22}
            />
          </div>
        </Link>
        <div className={getStyle('sidebar-content')}>
          <div className={getStyle('sidebar-user')}>
            <Image
              src={adminUser.imgUrl!}
              width={50}
              height={50}
              style={{ borderRadius: '50%' }}
            />
            <div className={getStyle('fw-bold')}>
              {getFullName(adminUser as NamedUser, { full: true })}
            </div>
          </div>

          <ul className={getStyle('sidebar-nav')}>
            <div className="mx-auto mb-5">Welcome back, {adminUser.firstName}</div>

            <li className={getStyle('sidebar-item active')}>
              <a
                data-bs-target="#dashboards"
                data-bs-toggle="collapse"
                className={getStyle('sidebar-link')}
              >
                <i className="align-middle me-2 fas fa-fw fa-home"></i>{' '}
                <span className={getStyle('align-middle')}>Dashboards</span>
              </a>
              <ul
                id="dashboards"
                className={getStyle('sidebar-dropdown list-unstyled collapse show')}
                data-bs-parent="#sidebar"
              >
                <li className={getStyle('sidebar-item active')}>
                  <a className={getStyle('sidebar-link')} href="dashboard-default.html">
                    Default
                  </a>
                </li>
                <li className={getStyle('sidebar-item')}>
                  <a className={getStyle('sidebar-link')} href="dashboard-analytics.html">
                    Analytics
                  </a>
                </li>
                <li className={getStyle('sidebar-item')}>
                  <a className={getStyle('sidebar-link')} href="dashboard-e-commerce.html">
                    E-commerce
                  </a>
                </li>
              </ul>
            </li>
            <li className={getStyle('sidebar-item')}>
              <a
                data-bs-target="#pages"
                data-bs-toggle="collapse"
                className={getStyle('sidebar-link collapsed')}
              >
                <i className="align-middle me-2 fas fa-fw fa-file"></i>{' '}
                <span className={getStyle('align-middle')}>Pages</span>
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
                <span className={getStyle('align-middle')}>Auth</span>
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
                <span className={getStyle('align-middle')}>User Interface</span>
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
                <span className={getStyle('align-middle')}>Charts</span>
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
                <span className={getStyle('align-middle')}>Forms</span>
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
                <span className={getStyle('align-middle')}>Tables</span>
              </a>
            </li>
            <li className={getStyle('sidebar-item')}>
              <a
                data-bs-target="#datatables"
                data-bs-toggle="collapse"
                className={getStyle('sidebar-link collapsed')}
              >
                <i className="align-middle me-2 fas fa-fw fa-table"></i>{' '}
                <span className={getStyle('align-middle')}>DataTables</span>
              </a>
              <ul
                id="datatables"
                className={getStyle('sidebar-dropdown list-unstyled collapse ')}
                data-bs-parent="#sidebar"
              >
                <li className={getStyle('sidebar-item')}>
                  <a
                    className={getStyle('sidebar-link')}
                    href="tables-datatables-responsive.html"
                  >
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
                <span className={getStyle('align-middle')}>Icons</span>
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
      <div className={getStyle('main')}>
        <nav className={getStyle('navbar navbar-expand navbar-theme')}>
          <a className={getStyle('sidebar-toggle d-flex me-2')}>
            <i className={getStyle('hamburger align-self-center')}></i>
          </a>

          <form className={getStyle('d-none d-sm-inline-block my-4')}>
            <input
              className={getStyle('form-control form-control-lite fs-3')}
              type="text"
              placeholder="Search projects..."
            />
          </form>

          <div className={getStyle('navbar-collapse collapse')}>
            <ul className={getStyle('navbar-nav ms-auto')}>
              <li className={getStyle('nav-item dropdown active')}>
                <a
                  className={getStyle('nav-link dropdown-toggle position-relative')}
                  href="#"
                  id="messagesDropdown"
                  data-bs-toggle="dropdown"
                >
                  <Icon icon="fluent:mail-read-16-filled" width={22} />
                </a>
                <div
                  className={getStyle('dropdown-menu dropdown-menu-lg dropdown-menu-end py-0')}
                  aria-labelledby="messagesDropdown"
                >
                  <div className={getStyle('dropdown-menu-header')}>
                    <div className="position-relative">4 New Messages</div>
                  </div>
                  <div className={getStyle('list-group')}>
                    <a href="#" className={getStyle('list-group-item')}>
                      <div className={getStyle('row g-0 align-items-center')}>
                        <div className={getStyle('col-2')}>
                          <img
                            src="img/avatars/avatar-5.jpg"
                            className={getStyle('avatar img-fluid rounded-circle')}
                            alt="Michelle Bilodeau"
                          />
                        </div>
                        <div className={getStyle('col-10 ps-2')}>
                          <div className={getStyle('text-dark')}>Michelle Bilodeau</div>
                          <div className={getStyle('text-muted small mt-1')}>
                            Nam pretium turpis et arcu. Duis arcu tortor.
                          </div>
                          <div className={getStyle('text-muted small mt-1')}>5m ago</div>
                        </div>
                      </div>
                    </a>
                    <a href="#" className={getStyle('list-group-item')}>
                      <div className={getStyle('row g-0 align-items-center')}>
                        <div className={getStyle('col-2')}>
                          <img
                            src="img/avatars/avatar-3.jpg"
                            className={getStyle('avatar img-fluid rounded-circle')}
                            alt="Kathie Burton"
                          />
                        </div>
                        <div className={getStyle('col-10 ps-2')}>
                          <div className={getStyle('text-dark')}>Kathie Burton</div>
                          <div className={getStyle('text-muted small mt-1')}>
                            Pellentesque auctor neque nec urna.
                          </div>
                          <div className={getStyle('text-muted small mt-1')}>30m ago</div>
                        </div>
                      </div>
                    </a>
                    <a href="#" className={getStyle('list-group-item')}>
                      <div className={getStyle('row g-0 align-items-center')}>
                        <div className={getStyle('col-2')}>
                          <img
                            src="img/avatars/avatar-2.jpg"
                            className={getStyle('avatar img-fluid rounded-circle')}
                            alt="Alexander Groves"
                          />
                        </div>
                        <div className={getStyle('col-10 ps-2')}>
                          <div className={getStyle('text-dark')}>Alexander Groves</div>
                          <div className={getStyle('text-muted small mt-1')}>
                            Curabitur ligula sapien euismod vitae.
                          </div>
                          <div className={getStyle('text-muted small mt-1')}>2h ago</div>
                        </div>
                      </div>
                    </a>
                    <a href="#" className={getStyle('list-group-item')}>
                      <div className={getStyle('row g-0 align-items-center')}>
                        <div className={getStyle('col-2')}>
                          <img
                            src="img/avatars/avatar-4.jpg"
                            className={getStyle('avatar img-fluid rounded-circle')}
                            alt="Daisy Seger"
                          />
                        </div>
                        <div className={getStyle('col-10 ps-2')}>
                          <div className={getStyle('text-dark')}>Daisy Seger</div>
                          <div className={getStyle('text-muted small mt-1')}>
                            Aenean tellus metus, bibendum sed, posuere ac, mattis non.
                          </div>
                          <div className={getStyle('text-muted small mt-1')}>5h ago</div>
                        </div>
                      </div>
                    </a>
                  </div>
                  <div className={getStyle('dropdown-menu-footer')}>
                    <a href="#" className={getStyle('text-muted')}>
                      Show all messages
                    </a>
                  </div>
                </div>
              </li>
              <li className={getStyle('nav-item dropdown ms-lg-2')}>
                <a
                  className={getStyle('nav-link dropdown-toggle position-relative')}
                  href="#"
                  id="alertsDropdown"
                  data-bs-toggle="dropdown"
                >
                  <Icon icon="mdi:bell" width={22} />
                  <span className={getStyle('indicator')}></span>
                </a>
                <div
                  className={getStyle('dropdown-menu dropdown-menu-lg dropdown-menu-end py-0')}
                  aria-labelledby="alertsDropdown"
                >
                  <div className={getStyle('dropdown-menu-header')}>4 New Notifications</div>
                  <div className={getStyle('list-group')}>
                    <a href="#" className={getStyle('list-group-item')}>
                      <div className={getStyle('row g-0 align-items-center')}>
                        <div className={getStyle('col-2')}>
                          <i className="ms-1 text-danger fas fa-fw fa-bell"></i>
                        </div>
                        <div className="col-10">
                          <div className={getStyle('text-dark')}>Update completed</div>
                          <div className={getStyle('text-muted small mt-1')}>
                            Restart server 12 to complete the update.
                          </div>
                          <div className={getStyle('text-muted small mt-1')}>2h ago</div>
                        </div>
                      </div>
                    </a>
                    <a href="#" className={getStyle('list-group-item')}>
                      <div className={getStyle('row g-0 align-items-center')}>
                        <div className={getStyle('col-2')}>
                          <i className="ms-1 text-warning fas fa-fw fa-envelope-open"></i>
                        </div>
                        <div className="col-10">
                          <div className={getStyle('text-dark')}>Lorem ipsum</div>
                          <div className={getStyle('text-muted small mt-1')}>
                            Aliquam ex eros, imperdiet vulputate hendrerit et.
                          </div>
                          <div className={getStyle('text-muted small mt-1')}>6h ago</div>
                        </div>
                      </div>
                    </a>
                    <a href="#" className={getStyle('list-group-item')}>
                      <div className={getStyle('row g-0 align-items-center')}>
                        <div className={getStyle('col-2')}>
                          <i className="ms-1 text-primary fas fa-fw fa-building"></i>
                        </div>
                        <div className="col-10">
                          <div className={getStyle('text-dark')}>Login from 192.186.1.1</div>
                          <div className={getStyle('text-muted small mt-1')}>8h ago</div>
                        </div>
                      </div>
                    </a>
                    <a href="#" className={getStyle('list-group-item')}>
                      <div className={getStyle('row g-0 align-items-center')}>
                        <div className={getStyle('col-2')}>
                          <i className="ms-1 text-success fas fa-fw fa-bell-slash"></i>
                        </div>
                        <div className="col-10">
                          <div className={getStyle('text-dark')}>New connection</div>
                          <div className={getStyle('text-muted small mt-1')}>
                            Anna accepted your request.
                          </div>
                          <div className={getStyle('text-muted small mt-1')}>12h ago</div>
                        </div>
                      </div>
                    </a>
                  </div>
                  <div className={getStyle('dropdown-menu-footer')}>
                    <a href="#" className={getStyle('text-muted')}>
                      Show all notifications
                    </a>
                  </div>
                </div>
              </li>
              <li className={getStyle('nav-item dropdown ms-lg-2')}>
                <a
                  className={getStyle('nav-link dropdown-toggle position-relative')}
                  href="#"
                  id="userDropdown"
                  data-bs-toggle="dropdown"
                >
                  <Icon icon="ant-design:setting-filled" width={22} />
                </a>
                <div
                  className={getStyle('dropdown-menu dropdown-menu-end')}
                  aria-labelledby="userDropdown"
                >
                  <a className={getStyle('dropdown-item')} href="#">
                    <i className="align-middle me-1 fas fa-fw fa-user"></i> View Profile
                  </a>
                  <a className={getStyle('dropdown-item')} href="#">
                    <i className="align-middle me-1 fas fa-fw fa-comments"></i> Contacts
                  </a>
                  <a className={getStyle('dropdown-item')} href="#">
                    <i className="align-middle me-1 fas fa-fw fa-chart-pie"></i> Analytics
                  </a>
                  <a className={getStyle('dropdown-item')} href="#">
                    <i className="align-middle me-1 fas fa-fw fa-cogs"></i> Settings
                  </a>
                  <div className="dropdown-divider"></div>
                  <a className={getStyle('dropdown-item')} href="#">
                    <i className="align-middle me-1 fas fa-fw fa-arrow-alt-circle-right"></i>{' '}
                    Sign out
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </nav>
        <main className={getStyle('content')}>
          <div className={getStyle('container-fluid')}>
            <div className={getStyle('header')}>
              <h1 className={getStyle('header-title fs-1')}>
                Welcome back, {adminUser.firstName}!
              </h1>
              <p className={getStyle('header-subtitle fs-4')}>
                You have{' '}
                {quantitize(props.messages?.length || 0, ['new message', 'new messages'])}.
              </p>
            </div>

            <div className={getStyle('row')}>
              <div className={getStyle('col-xl-6 col-xxl-7')}>
                <div className={getStyle('card flex-fill w-100')}>
                  <div className={getStyle('card-header')}>
                    <div className={getStyle('card-actions float-end')}>
                      <a href="#" className={getStyle('me-1')}>
                        <i className={getStyle('align-middle')} data-feather="refresh-cw"></i>
                      </a>
                      <div className={getStyle('d-inline-block dropdown show')}>
                        <a href="#" data-bs-toggle="dropdown" data-bs-display="static">
                          <i
                            className={getStyle('align-middle')}
                            data-feather="more-vertical"
                          ></i>
                        </a>

                        <div className={getStyle('dropdown-menu dropdown-menu-end')}>
                          <a className={getStyle('dropdown-item')} href="#">
                            Action
                          </a>
                          <a className={getStyle('dropdown-item')} href="#">
                            Another action
                          </a>
                          <a className={getStyle('dropdown-item')} href="#">
                            Something else here
                          </a>
                        </div>
                      </div>
                    </div>
                    <h5 className={getStyle('card-title mb-0')}>Recent Movement</h5>
                  </div>
                  <div className={getStyle('card-body py-3')}>
                    <div className={getStyle('chart chart-sm')}>
                      <canvas id="chartjs-dashboard-line"></canvas>
                    </div>
                  </div>
                </div>
              </div>

              <div className={getStyle('col-xl-6 col-xxl-5 d-flex')}>
                <div className={getStyle('w-100')}>
                  <div className={getStyle('row')}>
                    <div className={getStyle('col-sm-6')}>
                      <div className={getStyle('card')}>
                        <div className={getStyle('card-body')}>
                          <div className={getStyle('row')}>
                            <div className={getStyle('col mt-0')}>
                              <h5 className={getStyle('card-title')}>Sales Today</h5>
                            </div>

                            <div className={getStyle('col-auto')}>
                              <div className={getStyle('avatar')}>
                                <div
                                  className={getStyle(
                                    'avatar-title rounded-circle bg-primary-dark',
                                  )}
                                >
                                  <i
                                    className={getStyle('align-middle')}
                                    data-feather="truck"
                                  ></i>
                                </div>
                              </div>
                            </div>
                          </div>
                          <h1 className={getStyle('display-5 mt-1 mb-3')}>2.562</h1>
                          <div className={getStyle('mb-0')}>
                            <span className={getStyle('text-danger')}>
                              {' '}
                              <i
                                className={getStyle('mdi mdi-arrow-bottom-right')}
                              ></i> -2.65%{' '}
                            </span>
                            Less sales than usual
                          </div>
                        </div>
                      </div>
                      <div className={getStyle('card')}>
                        <div className={getStyle('card-body')}>
                          <div className={getStyle('row')}>
                            <div className={getStyle('col mt-0')}>
                              <h5 className={getStyle('card-title')}>Visitors Today</h5>
                            </div>

                            <div className={getStyle('col-auto')}>
                              <div className={getStyle('avatar')}>
                                <div
                                  className={getStyle(
                                    'avatar-title rounded-circle bg-primary-dark',
                                  )}
                                >
                                  <i
                                    className={getStyle('align-middle')}
                                    data-feather="users"
                                  ></i>
                                </div>
                              </div>
                            </div>
                          </div>
                          <h1 className={getStyle('display-5 mt-1 mb-3')}>17.212</h1>
                          <div className={getStyle('mb-0')}>
                            <span className="text-success">
                              {' '}
                              <i
                                className={getStyle('mdi mdi-arrow-bottom-right')}
                              ></i> 5.50%{' '}
                            </span>
                            More visitors than usual
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={getStyle('col-sm-6')}>
                      <div className={getStyle('card')}>
                        <div className={getStyle('card-body')}>
                          <div className={getStyle('row')}>
                            <div className={getStyle('col mt-0')}>
                              <h5 className={getStyle('card-title')}>Total Earnings</h5>
                            </div>

                            <div className={getStyle('col-auto')}>
                              <div className={getStyle('avatar')}>
                                <div
                                  className={getStyle(
                                    'avatar-title rounded-circle bg-primary-dark',
                                  )}
                                >
                                  <i
                                    className={getStyle('align-middle')}
                                    data-feather="dollar-sign"
                                  ></i>
                                </div>
                              </div>
                            </div>
                          </div>
                          <h1 className={getStyle('display-5 mt-1 mb-3')}>$24.300</h1>
                          <div className={getStyle('mb-0')}>
                            <span className="text-success">
                              {' '}
                              <i
                                className={getStyle('mdi mdi-arrow-bottom-right')}
                              ></i> 8.35%{' '}
                            </span>
                            More earnings than usual
                          </div>
                        </div>
                      </div>
                      <div className={getStyle('card')}>
                        <div className={getStyle('card-body')}>
                          <div className={getStyle('row')}>
                            <div className={getStyle('col mt-0')}>
                              <h5 className={getStyle('card-title')}>Pending Orders</h5>
                            </div>

                            <div className={getStyle('col-auto')}>
                              <div className={getStyle('avatar')}>
                                <div
                                  className={getStyle(
                                    'avatar-title rounded-circle bg-primary-dark',
                                  )}
                                >
                                  <i
                                    className={getStyle('align-middle')}
                                    data-feather="shopping-cart"
                                  ></i>
                                </div>
                              </div>
                            </div>
                          </div>
                          <h1 className={getStyle('display-5 mt-1 mb-3')}>43</h1>
                          <div className={getStyle('mb-0')}>
                            <span className={getStyle('text-danger')}>
                              {' '}
                              <i
                                className={getStyle('mdi mdi-arrow-bottom-right')}
                              ></i> -4.25%{' '}
                            </span>
                            Less orders than usual
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={getStyle('row')}>
              <div className={getStyle('col-12 col-md-6 col-xxl-3 d-flex order-1 order-xxl-1')}>
                <div className={getStyle('card flex-fill')}>
                  <div className={getStyle('card-header')}>
                    <div className={getStyle('card-actions float-end')}>
                      <a href="#" className={getStyle('me-1')}>
                        <i className={getStyle('align-middle')} data-feather="refresh-cw"></i>
                      </a>
                      <div className={getStyle('d-inline-block dropdown show')}>
                        <a href="#" data-bs-toggle="dropdown" data-bs-display="static">
                          <i
                            className={getStyle('align-middle')}
                            data-feather="more-vertical"
                          ></i>
                        </a>

                        <div className={getStyle('dropdown-menu dropdown-menu-end')}>
                          <a className={getStyle('dropdown-item')} href="#">
                            Action
                          </a>
                          <a className={getStyle('dropdown-item')} href="#">
                            Another action
                          </a>
                          <a className={getStyle('dropdown-item')} href="#">
                            Something else here
                          </a>
                        </div>
                      </div>
                    </div>
                    <h5 className={getStyle('card-title mb-0')}>Calendar</h5>
                  </div>
                  <div className={getStyle('card-body d-flex')}>
                    <div className={getStyle('align-self-center w-100')}>
                      <div className={getStyle('chart')}>
                        <div id="datetimepicker-dashboard"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={getStyle('col-12 col-md-12 col-xxl-6 d-flex order-3 order-xxl-2')}>
                <div className={getStyle('card flex-fill w-100')}>
                  <div className={getStyle('card-header')}>
                    <div className={getStyle('card-actions float-end')}>
                      <a href="#" className={getStyle('me-1')}>
                        <i className={getStyle('align-middle')} data-feather="refresh-cw"></i>
                      </a>
                      <div className={getStyle('d-inline-block dropdown show')}>
                        <a href="#" data-bs-toggle="dropdown" data-bs-display="static">
                          <i
                            className={getStyle('align-middle')}
                            data-feather="more-vertical"
                          ></i>
                        </a>

                        <div className={getStyle('dropdown-menu dropdown-menu-end')}>
                          <a className={getStyle('dropdown-item')} href="#">
                            Action
                          </a>
                          <a className={getStyle('dropdown-item')} href="#">
                            Another action
                          </a>
                          <a className={getStyle('dropdown-item')} href="#">
                            Something else here
                          </a>
                        </div>
                      </div>
                    </div>
                    <h5 className={getStyle('card-title mb-0')}>Current Visitors</h5>
                  </div>
                  <div className={getStyle('card-body px-4')}>
                    <div id="world_map" style={{ height: '350px' }}></div>
                  </div>
                </div>
              </div>
              <div className={getStyle('col-12 col-md-6 col-xxl-3 d-flex order-2 order-xxl-3')}>
                <div className={getStyle('card flex-fill w-100')}>
                  <div className={getStyle('card-header')}>
                    <div className={getStyle('card-actions float-end')}>
                      <a href="#" className={getStyle('me-1')}>
                        <i className={getStyle('align-middle')} data-feather="refresh-cw"></i>
                      </a>
                      <div className={getStyle('d-inline-block dropdown show')}>
                        <a href="#" data-bs-toggle="dropdown" data-bs-display="static">
                          <i
                            className={getStyle('align-middle')}
                            data-feather="more-vertical"
                          ></i>
                        </a>

                        <div className={getStyle('dropdown-menu dropdown-menu-end')}>
                          <a className={getStyle('dropdown-item')} href="#">
                            Action
                          </a>
                          <a className={getStyle('dropdown-item')} href="#">
                            Another action
                          </a>
                          <a className={getStyle('dropdown-item')} href="#">
                            Something else here
                          </a>
                        </div>
                      </div>
                    </div>
                    <h5 className={getStyle('card-title mb-0')}>Browser Usage</h5>
                  </div>
                  <div className={getStyle('card-body d-flex')}>
                    <div className={getStyle('align-self-center w-100')}>
                      <div className={getStyle('py-3')}>
                        <div className={getStyle('chart chart-xs')}>
                          <canvas id="chartjs-dashboard-pie"></canvas>
                        </div>
                      </div>

                      <table className={getStyle('table mb-0')}>
                        <tbody>
                          <tr>
                            <td>
                              <i className="fas fa-circle text-primary fa-fw"></i> Chrome
                            </td>
                            <td className={getStyle('text-end')}>4401</td>
                          </tr>
                          <tr>
                            <td>
                              <i className="fas fa-circle text-warning fa-fw"></i> Firefox
                            </td>
                            <td className={getStyle('text-end')}>4003</td>
                          </tr>
                          <tr>
                            <td>
                              <i className="fas fa-circle text-danger fa-fw"></i> IE
                            </td>
                            <td className={getStyle('text-end')}>1589</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={getStyle('row')}>
              <div className={getStyle('col-12 col-lg-8 col-xxl-9 d-flex')}>
                <div className={getStyle('card flex-fill')}>
                  <div className={getStyle('card-header')}>
                    <div className={getStyle('card-actions float-end')}>
                      <a href="#" className={getStyle('me-1')}>
                        <i className={getStyle('align-middle')} data-feather="refresh-cw"></i>
                      </a>
                      <div className={getStyle('d-inline-block dropdown show')}>
                        <a href="#" data-bs-toggle="dropdown" data-bs-display="static">
                          <i
                            className={getStyle('align-middle')}
                            data-feather="more-vertical"
                          ></i>
                        </a>

                        <div className={getStyle('dropdown-menu dropdown-menu-end')}>
                          <a className={getStyle('dropdown-item')} href="#">
                            Action
                          </a>
                          <a className={getStyle('dropdown-item')} href="#">
                            Another action
                          </a>
                          <a className={getStyle('dropdown-item')} href="#">
                            Something else here
                          </a>
                        </div>
                      </div>
                    </div>
                    <h5 className={getStyle('card-title mb-0')}>Latest Projects</h5>
                  </div>
                  <table
                    id="datatables-dashboard-projects"
                    className={getStyle('table table-striped my-0')}
                  >
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th className={getStyle('d-none d-xl-table-cell')}>Start Date</th>
                        <th className={getStyle('d-none d-xl-table-cell')}>End Date</th>
                        <th>Status</th>
                        <th className={getStyle('d-none d-md-table-cell')}>Assignee</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Project Apollo</td>
                        <td className={getStyle('d-none d-xl-table-cell')}>01/01/2021</td>
                        <td className={getStyle('d-none d-xl-table-cell')}>31/06/2021</td>
                        <td>
                          <span className={getStyle('badge bg-success')}>Done</span>
                        </td>
                        <td className={getStyle('d-none d-md-table-cell')}>Carl Jenkins</td>
                      </tr>
                      <tr>
                        <td>Project Fireball</td>
                        <td className={getStyle('d-none d-xl-table-cell')}>01/01/2021</td>
                        <td className={getStyle('d-none d-xl-table-cell')}>31/06/2021</td>
                        <td>
                          <span className={getStyle('badge bg-danger')}>Cancelled</span>
                        </td>
                        <td className={getStyle('d-none d-md-table-cell')}>Bertha Martin</td>
                      </tr>
                      <tr>
                        <td>Project Hades</td>
                        <td className={getStyle('d-none d-xl-table-cell')}>01/01/2021</td>
                        <td className={getStyle('d-none d-xl-table-cell')}>31/06/2021</td>
                        <td>
                          <span className={getStyle('badge bg-success')}>Done</span>
                        </td>
                        <td className={getStyle('d-none d-md-table-cell')}>Stacie Hall</td>
                      </tr>
                      <tr>
                        <td>Project Nitro</td>
                        <td className={getStyle('d-none d-xl-table-cell')}>01/01/2021</td>
                        <td className={getStyle('d-none d-xl-table-cell')}>31/06/2021</td>
                        <td>
                          <span className={getStyle('badge bg-warning')}>In progress</span>
                        </td>
                        <td className={getStyle('d-none d-md-table-cell')}>Carl Jenkins</td>
                      </tr>
                      <tr>
                        <td>Project Phoenix</td>
                        <td className={getStyle('d-none d-xl-table-cell')}>01/01/2021</td>
                        <td className={getStyle('d-none d-xl-table-cell')}>31/06/2021</td>
                        <td>
                          <span className={getStyle('badge bg-success')}>Done</span>
                        </td>
                        <td className={getStyle('d-none d-md-table-cell')}>Bertha Martin</td>
                      </tr>
                      <tr>
                        <td>Project X</td>
                        <td className={getStyle('d-none d-xl-table-cell')}>01/01/2021</td>
                        <td className={getStyle('d-none d-xl-table-cell')}>31/06/2021</td>
                        <td>
                          <span className={getStyle('badge bg-success')}>Done</span>
                        </td>
                        <td className={getStyle('d-none d-md-table-cell')}>Stacie Hall</td>
                      </tr>
                      <tr>
                        <td>Project Romeo</td>
                        <td className={getStyle('d-none d-xl-table-cell')}>01/01/2021</td>
                        <td className={getStyle('d-none d-xl-table-cell')}>31/06/2021</td>
                        <td>
                          <span className={getStyle('badge bg-success')}>Done</span>
                        </td>
                        <td className={getStyle('d-none d-md-table-cell')}>Ashley Briggs</td>
                      </tr>
                      <tr>
                        <td>Project Wombat</td>
                        <td className={getStyle('d-none d-xl-table-cell')}>01/01/2021</td>
                        <td className={getStyle('d-none d-xl-table-cell')}>31/06/2021</td>
                        <td>
                          <span className={getStyle('badge bg-warning')}>In progress</span>
                        </td>
                        <td className={getStyle('d-none d-md-table-cell')}>Bertha Martin</td>
                      </tr>
                      <tr>
                        <td>Project Zircon</td>
                        <td className={getStyle('d-none d-xl-table-cell')}>01/01/2021</td>
                        <td className={getStyle('d-none d-xl-table-cell')}>31/06/2021</td>
                        <td>
                          <span className={getStyle('badge bg-danger')}>Cancelled</span>
                        </td>
                        <td className={getStyle('d-none d-md-table-cell')}>Stacie Hall</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className={getStyle('col-12 col-lg-4 col-xxl-3 d-flex')}>
                <div className={getStyle('card flex-fill w-100')}>
                  <div className={getStyle('card-header')}>
                    <div className={getStyle('card-actions float-end')}>
                      <a href="#" className={getStyle('me-1')}>
                        <i className={getStyle('align-middle')} data-feather="refresh-cw"></i>
                      </a>
                      <div className={getStyle('d-inline-block dropdown show')}>
                        <a href="#" data-bs-toggle="dropdown" data-bs-display="static">
                          <i
                            className={getStyle('align-middle')}
                            data-feather="more-vertical"
                          ></i>
                        </a>

                        <div className={getStyle('dropdown-menu dropdown-menu-end')}>
                          <a className={getStyle('dropdown-item')} href="#">
                            Action
                          </a>
                          <a className={getStyle('dropdown-item')} href="#">
                            Another action
                          </a>
                          <a className={getStyle('dropdown-item')} href="#">
                            Something else here
                          </a>
                        </div>
                      </div>
                    </div>
                    <h5 className={getStyle('card-title mb-0')}>Monthly Sales</h5>
                  </div>
                  <div className={getStyle('card-body d-flex w-100')}>
                    <div className={getStyle('align-self-center chart chart-lg')}>
                      <canvas id="chartjs-dashboard-bar"></canvas>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <footer className={getStyle('footer')}>
          <div className={getStyle('container-fluid')}>
            <div className={getStyle('row text-muted')}>
              <div className={getStyle('col-8 text-start')}>
                <ul className={getStyle('list-inline')}>
                  <li className={getStyle('list-inline-item')}>
                    <a className={getStyle('text-muted')} href="#">
                      Support
                    </a>
                  </li>
                  <li className={getStyle('list-inline-item')}>
                    <a className={getStyle('text-muted')} href="#">
                      Privacy
                    </a>
                  </li>
                  <li className={getStyle('list-inline-item')}>
                    <a className={getStyle('text-muted')} href="#">
                      Terms of Service
                    </a>
                  </li>
                  <li className={getStyle('list-inline-item')}>
                    <a className={getStyle('text-muted')} href="#">
                      Contact
                    </a>
                  </li>
                </ul>
              </div>
              <div className={getStyle('col-4 text-end')}>
                <p className={getStyle('mb-0')}>
                  &copy; 2022 -{' '}
                  <Link href="/" className={getStyle('text-muted')}>
                    Localinspire
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async function ({ req, res }) {
  const session = await unstable_getServerSession(req, res, authOptions as NextAuthOptions);

  if (!session || session.user.role !== 'MAIN_ADMIN')
    return { redirect: { destination: '/', permanent: true } };

  const newMessages = await api.getUnreadMsgs(session.user.accessToken);

  return { props: { ...newMessages } };
};

export default AdminPage;
