import { FunctionComponent } from 'react';

import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import GoogleIcon from '@mui/icons-material/Google';
import InfoIcon from '@mui/icons-material/Info';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import Image from 'next/image';

function Footer() {
  return (
    <footer className="footer">
      <nav className="footer-nav">
        <ul className="no-bullets">
          <li className="footer-col">
            <a href="#">
              <img src="img/localinspire-logo.jpeg" alt="" />
            </a>
            <span>© 2022 Local Inspire Inc.</span>
          </li>
          <li className="footer-col">
            <h6>About</h6>
            <ul>
              <li>
                <a href="#">About Local Inspire</a>
              </li>
            </ul>
          </li>
          <li className="footer-col">
            <h6>Get listed</h6>
            <ul>
              <li>
                <a href="#">Add a business</a>
              </li>
            </ul>
          </li>
          <li className="footer-col">
            <h6>Our location</h6>
            <ul>
              <li>
                <a href="#">
                  <InfoIcon fontSize="medium" />
                  Help
                </a>
              </li>
              <li>
                <a href="#">
                  <PersonRoundedIcon
                    fontSize="large"
                    style={{ marginLeft: '-3px' }}
                  />
                  Your account
                </a>
              </li>
              <li>
                <a href="#">
                  <Image
                    src="/img/usa-flag.png"
                    alt="United States"
                    width="20"
                    height="15"
                  />
                  <span>United States</span>
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
      <div className="footer-bottom">
        <div className="footer-socials">
          <a href="#">
            <FacebookIcon fontSize="large" />
          </a>
          <a href="">
            <GoogleIcon fontSize="large" />
          </a>
          <a href="">
            <TwitterIcon fontSize="large" />
          </a>
        </div>
        <div className="">
          <a href="#">Privacy & policy</a>
          <a href="">Terms & conditions</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer as FunctionComponent;
