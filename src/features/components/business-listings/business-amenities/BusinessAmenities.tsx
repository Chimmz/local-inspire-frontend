import React, { useState } from 'react';
import cls from 'classnames';
import styles from './styles.module.scss';
import { Modal } from 'react-bootstrap';

const BusinessAmenities = function () {
  const [showModal, setShowModal] = useState(false);
  const [modalCurrentTab, setModalCurrentTab] = useState<'about' | 'features' | 'types'>(
    'about',
  );

  return (
    <div className={cls(styles.tableContent, 'd-flex gap-5')}>
      <article className="about mt-4" style={{ flex: '40%' }}>
        <section className={styles.about}>
          <p className="parag mb-3 mt-3">
            At Crystals Cabin we strive on comfort, cleanliness, and an all around good time.
            We welcome you to join us for a weekend getaway.
          </p>
          <p className="parag mb-5">
            <strong> Fannies BBQ</strong> was established in 1985.
          </p>
        </section>
      </article>
      <ul className={cls(styles.amenities, 'ps-4 no-bullets border-left')}>
        <li className="mt-4">
          <strong>Arriving</strong>
          <p>3:00 PM</p>
        </li>

        <li>
          <strong>How may square feet?</strong>
          <p>5020</p>
        </li>

        <li>
          <strong>How many Acres?</strong>
          <p>50</p>
        </li>

        <li>
          <strong>Leaving</strong>
          <p>11:00 AM</p>
        </li>

        <li>
          <strong>Rental Type</strong>
          <p>Cabin</p>
        </li>

        <li>
          <strong>Beds</strong>
          <p>Bunk Beds, Twin</p>
        </li>

        <li>
          <strong>Fireplace</strong>
          <p>Indoor Wood, Outdoor Wood</p>
        </li>

        {/* <li>
          <strong>Grills</strong>
          <p>Charcoal</p>
        </li>

        <li>
          <strong>Hot Tub</strong>
          <p>Indoor, Outdoor</p>
        </li>

        <li>
          <strong>Amenities</strong>
          <p>
            TV, Elevator/Lift Access, Pool, Pool Table, Firepit, Covered Breezeway, Skiing
          </p>
        </li> */}

        <button
          className="btn btn-bg-none d-block text-pry text-center"
          onClick={setShowModal.bind(null, true)}
        >
          <strong> See more</strong>
        </button>

        {/*<li>
          <strong>House Rules</strong>
          <p>Kid-Friendly</p>
        </li>

        <li>
          <strong>Kitchen</strong>
          <p>
            Dishes, Dishwasher, Kitchen utensils, Microwave, Refrigerator, Sink, Stove, Oven,
            Coffee maker, Toaster
          </p>
        </li>

        <li>
          <strong>Water Access</strong>
          <p>Beach, Pond</p>
        </li>

        <li>
          <strong>Accessibility</strong>
          <p>Accessible Bathroom, In-room Accessibility, Ramp</p>
        </li>

         <li>
        <strong>Required at check in</strong>
        <p>Credit card or cash deposit</p>
      </li>

      <li>
        <strong>How expensive is this Rental?</strong>
        <p>Budget</p>
      </li>

      <li>
        <strong>Nearby Activities</strong>
        <p>Boating, Fishing, Tennis</p>
      </li>

      <li>
        <strong>Properties good for</strong>
        <p>Families</p>
      </li>

      <li>
        <strong>Safety Features</strong>
        <p>
          Smoke Detector, Fire Extinguisher, Deadbolt Lock, Exterior lighting, Carbon-monoxide
          Detector, First-aid Kit
        </p>
      </li>

      <li>
        <strong>Sleeps</strong>
        <p>1</p>
      </li>

      <li>
        <strong>Bedrooms</strong>
        <p>1</p>
      </li>

      <li>
        <strong>Bathrooms</strong>
        <p>1</p>
      </li> */}
      </ul>

      <Modal show={showModal} onHide={setShowModal.bind(null, false)} centered size="lg">
        <Modal.Body className="p-5">
          <h2 className="mb-5">Amenities</h2>
          <nav className={styles.nav}>
            <button
              onClick={setModalCurrentTab.bind(null, 'about')}
              data-active={`${modalCurrentTab === 'about'}`}
            >
              About
            </button>
            <button
              onClick={setModalCurrentTab.bind(null, 'features')}
              data-active={`${modalCurrentTab === 'features'}`}
            >
              Room features
            </button>
            <button
              onClick={setModalCurrentTab.bind(null, 'types')}
              data-active={`${modalCurrentTab === 'types'}`}
            >
              Room Types
            </button>
          </nav>
          <div className={cls(modalCurrentTab === 'about' ? 'd-block' : 'd-none')}></div>
          <ul
            className={cls(
              modalCurrentTab === 'features' ? 'd-block' : 'd-none',
              styles.roomFeatures,
              'no-bullets',
            )}
          >
            <li>Air Conditioning</li>
            <li>Housekeeping</li>
            <li>Coffee/tea maker</li>
            <li>Flatscreen TV</li>
            <li>Safe</li>
            <li>Sofa</li>
            <li>Desk</li>
            <li>Private balcony</li>
            <li>Microwave</li>
            <li>Walk-in-shower</li>
            <li>Seating area</li>
            <li>Telephone</li>
          </ul>
          <div className={cls(modalCurrentTab === 'types' ? 'd-block' : 'd-none')}></div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default BusinessAmenities;
