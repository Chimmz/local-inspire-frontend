import cls from 'classnames';
import Image from 'next/image';
import styles from './Header.module.scss';

function HeaderServices() {
  const services = [
    { id: 'hotels', name: 'Hotels', icon: '/icons/restaurant-icon.png' },
    { id: 'restaurants', name: 'Restaurants', icon: '/icons/hotel-icon.png' },
    { id: 'things-to-do', name: 'Things to do', icon: '/icons/things-icon.png' },
    {
      id: 'vacation-rentals',
      name: 'Vacation Rentals',
      icon: '/icons/vacation-icon.png',
    },
    { id: 'flights', name: 'Flights', icon: '/icons/flights-icon.png' },
  ];

  return (
    <ul className={cls(styles['header-services'], 'no-bullets')}>
      {services.map(({ id, name, icon }) => (
        <li key={id}>
          <a href="">
            <Image src={icon} alt={name} width={30} height="30" />
            <span>{name}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

export default HeaderServices;
