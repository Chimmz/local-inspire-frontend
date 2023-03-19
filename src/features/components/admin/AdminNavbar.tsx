import { Icon } from '@iconify/react';
import { NextPage } from 'next';
import React from 'react';

interface Props {
  getStyle: (className: string) => string;
  toggleSidebar(): void;
}

const AdminNavbar = function (props: Props) {
  const { getStyle } = props;

  return (
    <nav className={getStyle('navbar navbar-expand navbar-theme')}>
      {/* Hamburger */}
      <span className={getStyle('sidebar-toggle d-flex me-2')} onClick={props.toggleSidebar}>
        <i className={getStyle('hamburger align-self-center')}></i>
      </span>

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
                <i className="align-middle me-1 fas fa-fw fa-arrow-alt-circle-right"></i> Sign
                out
              </a>
            </div>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default AdminNavbar;
