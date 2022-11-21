interface Props {
  styles: { readonly [key: string]: string };
}

const Filters = ({ styles }: Props) => {
  return (
    <aside className={styles.filter}>
      <div className={styles.filterSection}>
        <span className={styles.filterType}>Establishment Type</span>

        <label htmlFor="Restaurants">
          <input type="checkbox" id="Restaurants" />
          <span>Restaurants</span>
        </label>

        <label htmlFor="Bakeries">
          <input type="checkbox" id="Bakeries" />
          <span>Bakeries</span>
        </label>

        <label htmlFor="Delivery Only">
          <input type="checkbox" id="Delivery Only" />
          <span>Delivery Only</span>
        </label>
      </div>

      <div className={styles.filterSection}>
        <span className={styles.filterType}>Restaurant features</span>

        <label htmlFor="Restaurants">
          <input type="checkbox" id="Restaurants" />
          <span>Takeout</span>
        </label>

        <label htmlFor="">
          <input type="checkbox" />
          <span>Reservations</span>
        </label>

        <label htmlFor="">
          <input type="checkbox" />
          <span>Buffet</span>
        </label>

        <label htmlFor="">
          <input type="checkbox" />
          <span>Outdoor Seating</span>
        </label>
      </div>

      <div className={styles.filterSection}>
        <span className={styles.filterType}>Meals</span>

        <label htmlFor="Restaurants">
          <input type="checkbox" id="Restaurants" />
          <span>Breakfast</span>
        </label>

        <label htmlFor="">
          <input type="checkbox" />
          <span>Brunch</span>
        </label>

        <label htmlFor="">
          <input type="checkbox" />
          <span>Lunch</span>
        </label>

        <label htmlFor="">
          <input type="checkbox" />
          <span>Dinner</span>
        </label>
      </div>
    </aside>
  );
};

export default Filters;
