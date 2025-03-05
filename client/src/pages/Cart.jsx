import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./BookDining.module.css";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart, clearCart } from "../redux/cartSlice";
import { PDFDocument, rgb } from "pdf-lib"; // Import pdf-lib
import fontkit from "@pdf-lib/fontkit";
import pdfFont from "../forms/Ubuntu-R.ttf";
import { privateRequest } from "../utils/useFetch";
import { menuItems1 } from "../fooddata";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const cartSlice = useSelector((state) => state.cart);
  const user = useSelector((state) => state.user);
  const cart = cartSlice.cartItems;
  const totalAmount = cartSlice.totalAmount;
  const dispatch = useDispatch();
  const http = privateRequest(user.accessToken, user.refreshToken);
  const [bookingDate, setBookingDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [selectedReservationId, setSelectedReservationId] = useState("");
  const [acceptedRequests, setAcceptedRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);

  const isCartEmpty = Object.keys(cart).length === 0;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAcceptedRequests = async () => {
      try {
        const res = await http.get("/reservation/APPROVED");
        // console.log(res)
        setAcceptedRequests(res.data);
      } catch (error) {
        console.error("Error fetching accepted requests:", error);
        // Handle error
      }
    };
    fetchAcceptedRequests();
  }, []);

  useEffect(() => {
    // Filter accepted requests based on booking date
    const filtered = acceptedRequests.filter((request) => {
      const arrivalDate = new Date(request.arrivalDate);
      const departureDate = new Date(request.departureDate);
      const bookingDateTime = new Date(bookingDate);
      // console.log("Before appending current time:", bookingDateTime);

      // // Append current time to booking date
      // bookingDateTime.setHours(new Date().getHours());
      // bookingDateTime.setMinutes(new Date().getMinutes());
      // bookingDateTime.setSeconds(new Date().getSeconds());

      // console.log("After appending current time:", bookingDateTime);
      return arrivalDate <= bookingDateTime && bookingDateTime <= departureDate;
    });
    setFilteredRequests(filtered);
  }, [bookingDate, acceptedRequests]);

  const handleOrder = async () => {
    if (!bookingDate) {
      toast.error("Please select a booking date.");
      return;
    }
    let foodItems = [];

    for (let [key, value] of Object.entries(cart)) {
      let index = key - 1;
      const { name, price, id, category } = menuItems1[index];
      foodItems.push({ name, price, id, category, quantity: value });
    }
    try {
      await http.post("/dining", {
        items: foodItems,
        reservationId:
          selectedReservationId === "default" ||
          selectedReservationId === "not_in_reservation"
            ? null
            : selectedReservationId,
        dateofbooking: bookingDate,
        sourceofpayment: paymentMethod,
      });
      
      dispatch(clearCart());
      alert(`Total Amount: ₹${totalAmount.toFixed(2)}`);
      navigate('../../dining')
    } catch (error) {}

    // Further actions like sending the order to a server or resetting the cart can be performed here.
  };

  const handleGetReceipt = async () => {
    try {
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage();
      const { width, height } = page.getSize();

      const fontBytes = await fetch(pdfFont).then((res) => res.arrayBuffer());
      pdfDoc.registerFontkit(fontkit);
      const ubuntuFont = await pdfDoc.embedFont(fontBytes, { subset: true });

      const logoUrl = `${process.env.PUBLIC_URL}/pdf-images/IIT-logo.png`;
      const logoImageBytes = await fetch(logoUrl).then((res) =>
        res.arrayBuffer()
      );
      const logoImage = await pdfDoc.embedPng(logoImageBytes);
      const logoHeight = 50;
      const logoWidth = (logoImage.width / logoImage.height) * logoHeight;

      // Add logo to the top-left corner of the page
      page.drawImage(logoImage, {
        x: 50,
        y: height - logoHeight - 30,
        width: logoWidth,
        height: logoHeight,
      });

      // Add institution name to the top-right corner
      page.drawText("IIT Ropar", {
        x: width - 150,
        y: height - 50,
        size: 20,
        font: ubuntuFont,
        color: rgb(0, 0, 0),
      });

      // Add food receipt text in bold
      const receiptText = "Food Receipt";
      page.drawText(receiptText, {
        x: width / 2 - 70,
        y: height - logoHeight - 30 - 20, // Adjust position as needed
        size: 24,
        font: ubuntuFont,
        color: rgb(0, 0, 0),
        bold: true,
      });

      // Table setup
      const tableTop = height - 150;
      const columnPositions = [50, 200, 300, 400, 500]; // Adjust based on your needs
      const rowHeight = 20;

      // Draw table headers
      page.drawText("Item Name", {
        x: columnPositions[0],
        y: tableTop,
        size: 12,
        font: ubuntuFont,
      });
      page.drawText("Quantity", {
        x: columnPositions[1],
        y: tableTop,
        size: 12,
        font: ubuntuFont,
      });
      page.drawText("Price", {
        x: columnPositions[2],
        y: tableTop,
        size: 12,
        font: ubuntuFont,
      });
      page.drawText("Total", {
        x: columnPositions[3],
        y: tableTop,
        size: 12,
        font: ubuntuFont,
      });

      // Draw line under headers
      page.drawLine({
        start: { x: 50, y: tableTop - 15 },
        end: { x: width - 50, y: tableTop - 15 },
        thickness: 1,
        color: rgb(0, 0, 0),
      });

      let currentRowY = tableTop - 15 - rowHeight;

      // List items in table
      Object.keys(cart).forEach((itemId) => {
        const item = menuItems1.find((item) => item.id === parseInt(itemId));
        const itemTotal = (item.price * cart[item.id]).toFixed(2);

        page.drawText(item.name, {
          x: columnPositions[0],
          y: currentRowY,
          size: 10,
          font: ubuntuFont,
        });
        page.drawText(cart[item.id].toString(), {
          x: columnPositions[1],
          y: currentRowY,
          size: 10,
          font: ubuntuFont,
        });
        page.drawText(`₹${item.price.toFixed(2)}`, {
          x: columnPositions[2],
          y: currentRowY,
          size: 10,
          font: ubuntuFont,
        });
        page.drawText(`₹${itemTotal}`, {
          x: columnPositions[3],
          y: currentRowY,
          size: 10,
          font: ubuntuFont,
        });

        // Draw a line after each item row (optional, for better separation)
        currentRowY -= rowHeight; // Move to next row position
      });

      // Total Amount
      currentRowY -= rowHeight; // Extra space before total
      page.drawText(`Total Amount: ₹${totalAmount.toFixed(2)}`, {
        x: columnPositions[0],
        y: currentRowY,
        size: 12,
        font: ubuntuFont,
        color: rgb(0.95, 0.1, 0.1), // Using a different color for emphasis
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      window.open(url);
    } catch (error) {
      console.error("Error generating receipt:", error);
      alert("Error generating receipt. Please try again later.");
    }
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const handleDateChange = (e) => {
    setBookingDate(e.target.value);
  };

  const handleReservationChange = (e) => {
    setSelectedReservationId(e.target.value);
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  return (
    <div>
      <div className={styles.cart + ' font-["Dosis"]'}>
        <h2 className='text-3xl font-["Dosis"] text-center pb-2'>CART</h2>
        {isCartEmpty ? (
          <>
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Action</th>
                </tr>
              </thead>
            </table>
            <p className={styles.noResult}>Cart is empty.</p>
          </>
        ) : (
          <div className="">
            <div className="flex flex-row my-5 items-baseline">
              <p className="mr-10">Date of Booking</p>
              <input
                className="mr-10 p-1"
                type="date"
                value={bookingDate}
                onChange={handleDateChange}
                min={
                  new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
                    .toISOString()
                    .split("T")[0]
                }
                style={{ color: "black" }} // Set the color to black
              />
              <p>Note : Booking has to be done 2 days prior.</p>
            </div>
            <div className="flex flex-row my-5 items-baseline text-black">
              <p className="mr-10 text-white">Select Reservation</p>
              <select
                name="ReservationConnected"
                className="mr-10 p-1"
                onChange={handleReservationChange}
                value={selectedReservationId}
              >
                <option className="" value="default">
                  Choose reservation
                </option>
                <option className="" value="not_in_reservation">
                  Not in any reservation
                </option>
                {filteredRequests.map((request) => (
                  <option className="" key={request._id} value={request._id}>
                    {request.guestName}'s reservation
                  </option>
                ))}
              </select>
              {selectedReservationId !== "default" &&
                selectedReservationId !== "" &&
                selectedReservationId !== "not_in_reservation" && (
                  <button
                    className="text-white"
                    onClick={() =>
                      navigate(`../../reservation/${selectedReservationId}`)
                    }
                  >
                    View Details
                  </button>
                )}
            </div>

            <div className="flex flex-row my-5 items-baseline text-black">
              <p className="mr-10 text-white">Payment Method</p>
              <select
                name="paymentMethod"
                className="mr-10 p-1"
                onChange={handlePaymentMethodChange}
                value={paymentMethod}
              >
                <option value="">Select payment method</option>
                <option value="GUEST">Payment by guest</option>
                <option value="DEPARTMENT">Payment by department</option>
              </select>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(cart).map((itemId, index) => {
                  const item = menuItems1.find(
                    (item) => item.id === parseInt(itemId)
                  );
                  return (
                    <tr key={"item-" + index}>
                      <td>{item.name}</td>
                      <td>₹{(item.price * cart[item.id]).toFixed(2)}</td>
                      <td className="">{cart[item.id]}</td>
                      <td className="w-1/4">
                        <button
                          className={styles.add + " mr-16"}
                          onClick={() => dispatch(addToCart(item.id))}
                        >
                          Add
                        </button>
                        <button
                          className={styles.remove}
                          onClick={() => dispatch(removeFromCart(item.id))}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <p className={styles.total + ' font-["Dosis"] text-xl'}>
              AMOUNT : ₹{totalAmount.toFixed(2)}
            </p>
            <div className="flex justify-center ">
              <button onClick={handleOrder} className={styles.button + " "}>
                Order
              </button>
              <button
                onClick={handleGetReceipt}
                className={styles.button + " "}
              >
                Get Receipt
              </button>
              <button onClick={handleClearCart} className={styles.button + " "}>
                Clear Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
