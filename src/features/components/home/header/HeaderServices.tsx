import cls from 'classnames';
import Image from 'next/image';
import styles from './Header.module.scss';

function HeaderServices() {
  return (
    <ul className={cls(styles['header-services'], 'no-bullets')}>
      <li>
        <a href="">
          <Image
            src="/icons/hotel-icon.png"
            alt="Hotels"
            width={30}
            height="30"
          />
          <span>Hotels</span>
        </a>
      </li>
      <li>
        <a href="">
          <Image
            src="/icons/restaurant-icon.png"
            alt="Restaurants"
            width="30"
            height="30"
          />
          <span>Restaurants</span>
        </a>
      </li>
      <li>
        <a href="">
          <Image
            src="/icons/things-icon.png"
            alt="Things to do"
            width="30"
            height="30"
          />
          <span>Things to do</span>
        </a>
      </li>
      <li>
        <a href="">
          <Image
            src="/icons/vacation-icon.png"
            alt="Vacation Rentals"
            width="30"
            height="30"
          />
          <span>Vacation Rentals</span>
        </a>
      </li>
      <li>
        <a href="">
          <Image
            src="/icons/flights-icon.png"
            alt="Flights"
            width="30"
            height="30"
          />
          <span>Flights</span>
        </a>
      </li>
      <li>
        <a href="">
          <Image src="/icons/cars-icon.png" alt="" width="30" height="30" />
          <label htmlFor="">Car Rentals</label>
        </a>
      </li>
    </ul>
  );
}

export default HeaderServices;
