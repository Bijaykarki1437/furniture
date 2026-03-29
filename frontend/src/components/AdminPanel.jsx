import React, { useState, useEffect } from "react";

function AdminPanel() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadOrders();
  }, []);

  // ✅ LOAD ORDERS FROM BACKEND
  const loadOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/orders/admin", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      setOrders(data);
    } catch (err) {
      alert("Failed to load orders");
    }
  };

  // ✅ UPDATE ORDER STATUS
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:5000/api/orders/${orderId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const data = await res.json();

      if (!res.ok) return alert(data.message);

      loadOrders();
    } catch (err) {
      alert("Error updating order");
    }
  };

  // ✅ UPDATE PAYMENT STATUS
  const updatePaymentStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:5000/api/orders/${orderId}/payment`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ paymentStatus: newStatus }),
        }
      );

      const data = await res.json();

      if (!res.ok) return alert(data.message);

      loadOrders();
    } catch (err) {
      alert("Error updating payment");
    }
  };

  // ✅ FILTER LOGIC (FIXED)
  const filteredOrders = orders.filter((order) => {
    if (filter === "all") return true;
    return order.status === filter;
  });

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h2>Admin Panel - Order Management</h2>

        <div className="filter-buttons">
          <button onClick={() => setFilter("all")}>All</button>
          <button onClick={() => setFilter("pending")}>Pending</button>
          <button onClick={() => setFilter("processing")}>Processing</button>
          <button onClick={() => setFilter("shipped")}>Shipped</button>
          <button onClick={() => setFilter("delivered")}>Delivered</button>
        </div>
      </div>

      <div className="orders-list">
        {filteredOrders.map((order) => (
          <div key={order._id} className="order-card">
            {/* HEADER */}
            <div className="order-header">
              <div>
                <strong>Order #{order._id.slice(-6)}</strong>

                <span className={`status-badge ${order.status}`}>
                  {order.status}
                </span>

                <span className={`payment-badge ${order.paymentStatus}`}>
                  {order.paymentStatus === "pending_verification"
                    ? "Waiting Verification"
                    : order.paymentStatus}
                </span>
              </div>

              <div className="order-date">
                {new Date(order.createdAt).toLocaleString()}
              </div>
            </div>

            {/* DETAILS */}
            <div className="order-details">
              <div className="customer-info">
                <strong>{order.address.fullName}</strong>
                <p>{order.address.phone}</p>
                <p>{order.address.email}</p>

                <p className="address">
                  {order.address.tole},{" "}
                  {order.address.municipality}-{order.address.wardNo}
                  <br />
                  {order.address.district}, {order.address.province}
                </p>
              </div>

              <div className="order-items-summary">
                <strong>Items:</strong>
                {order.items.map((item) => (
                  <div key={item.productId}>
                    {item.name} × {item.quantity} = Rs.{" "}
                    {(item.price * item.quantity).toFixed(2)}
                  </div>
                ))}
              </div>

              <div className="order-total">
                <strong>Total: Rs. {order.total.toFixed(2)}</strong>
                <div>
                  Payment:{" "}
                  {order.paymentMethod === "cod"
                    ? "Cash on Delivery"
                    : "eSewa"}
                </div>
              </div>
            </div>

            {/* eSEWA DETAILS */}
            {order.transactionCode && (
              <div className="esewa-payment-info">
                <h4>eSewa Payment Details</h4>
                <p>Transaction Code: {order.transactionCode}</p>

                {order.transactionImage && (
                  <div className="payment-screenshot">
                    <img
                      src={order.transactionImage}
                      alt="Payment Proof"
                      width="120"
                    />

                    <button
                      onClick={() =>
                        window.open(order.transactionImage, "_blank")
                      }
                      className="view-image-btn"
                    >
                      View Full Image
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ACTIONS */}
            <div className="order-actions">
              <select
                value={order.status}
                onChange={(e) =>
                  updateOrderStatus(order._id, e.target.value)
                }
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
              </select>

              {order.paymentStatus === "pending_verification" && (
                <div className="payment-actions">
                  <button
                    className="verify-payment"
                    onClick={() =>
                      updatePaymentStatus(order._id, "verified")
                    }
                  >
                    Verify Payment
                  </button>

                  <button
                    className="reject-payment"
                    onClick={() =>
                      updatePaymentStatus(order._id, "rejected")
                    }
                  >
                    Reject Payment
                  </button>
                </div>
              )}

              {order.paymentStatus === "verified" && (
                <span className="verified-badge">
                  ✓ Payment Verified
                </span>
              )}
            </div>
          </div>
        ))}

        {filteredOrders.length === 0 && (
          <div className="no-orders">No orders found</div>
        )}
      </div>
    </div>
  );
}

export default AdminPanel;