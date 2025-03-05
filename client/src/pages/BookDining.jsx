import React, { useState } from "react";
import styles from "./BookDining.module.css";
import { menuItems1 } from "../fooddata";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart, setCart } from "../redux/cartSlice";
import BasicTabs from "../components/Tabs";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Link } from "react-router-dom"; // Import Link for navigation

export const DiningCard = ({ items }) => {
  const cartSlice = useSelector((state) => state.cart);
  const cart = cartSlice.cartItems;
  const dispatch = useDispatch();

  return (
    <div className={styles.menuItems}>
      {items.length === 0 && <p className={styles.noResult}>No items found.</p>}
      {items.map((item) => (
        <div key={item.id} className={styles.card}>
          <div className={styles.cardContent}>
            <div className={styles.cardTitle}>{item.name}</div>
            <div className={styles.cardPrice}>₹{item.price.toFixed(2)}</div>
            <div className={styles.cardActions}>
              { (
                <button
                  onClick={() => dispatch(removeFromCart(item.id))}
                  className={styles.actionButton}
                >
                  -
                </button>
              )}
              <input
                value={Number(cart[item.id] || 0)}
                onChange={(e) => {
                  dispatch(setCart({ id: item.id, quantity: e.target.value }));
                }}
                className={`${styles.amount} w-14 text-center px-2 border-black rounded-md`}
              ></input>
              <button
                onClick={() => dispatch(addToCart(item.id))}
                className={styles.actionButton}
              >
                +
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const BookDining = () => {
  const cartSlice = useSelector((state) => state.cart);
  const cart = cartSlice.cartItems;
  const totalAmount = cartSlice.totalAmount;

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  let filteredMenuItems = menuItems1.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tabs = ["Main Course", "Snacks", "Drinks"];

  const tabItems = tabs.map((tab) =>
    filteredMenuItems.filter((item) => item.category === tab)
  );

  return (
    <div className={styles.container}>
      <h1 className="text-3xl font-semibold pb-5 uppercase font-['Dosis']">
        Book Dining
      </h1>
      <div className={styles.options}>
        <input
          type="text"
          placeholder="Search items..."
          value={searchTerm}
          onChange={handleSearchChange}
          className={styles.searchInput}
        />

        <BasicTabs tabs={tabs} tabItems={tabItems} />
      </div>
      <div className="flex justify-center mt-5">
        <Link
          to="../cart"
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
        >
          Go to Cart <ShoppingCartIcon />
        </Link>
      </div>
    </div>
  );
};

export default BookDining;
