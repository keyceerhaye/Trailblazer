import React from "react";
import "./OrderDetailView.css";

// Reusable Card Components
const CustomerCard = ({ order }) => (
  <div className="ad-detail-section ad-customer-section">
    <h3 className="ad-section-title">Customer</h3>
    <div className="ad-customer-info">
      <span>
        <strong>Name:</strong> {order.name}
      </span>
      <span>
        <strong>Phone:</strong> +639994563218
      </span>
      <span>
        <strong>Email:</strong> {order.name.toLowerCase().replace(" ", "")}
        @gmail.com
      </span>
    </div>
  </div>
);

const DeliveryDetailsSection = ({ order }) => (
  <div className="ad-delivery-section">
    <h3 className="ad-section-title">Delivery Details</h3>
    <div className="ad-delivery-info">
      <div>
        <strong>Name:</strong> {order.name}
      </div>
      <div>
        <strong>Address:</strong> CEA Building, 41-304
      </div>
      <div>
        <strong>Delivery Time:</strong> 1:00 P.M
      </div>
      <div>
        <strong>Turnaround Time:</strong> Standard
      </div>
      <div>
        <strong>Phone:</strong> +639994563218
      </div>
    </div>
  </div>
);

const NotesSection = () => (
  <div className="ad-notes-section">
    <h3 className="ad-section-title">Notes</h3>
    <div className="ad-notes-content">Deliver It Faster</div>
  </div>
);

const ProductSection = ({ order }) => (
  <div className="ad-product-section">
    <table className="ad-product-table">
      <thead>
        <tr>
          <th>Product</th>
          <th>Price</th>
          <th>Quantity</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Sde Docs</td>
          <td>₱25.00</td>
          <td>1</td>
          <td>₱25.00</td>
        </tr>
      </tbody>
    </table>

    <div className="ad-order-summary">
      <div className="ad-summary-row">
        <span>Delivery Fee:</span>
        <span>₱10.00</span>
      </div>
      <div className="ad-summary-row">
        <span>Turnaround Fee:</span>
        <span>₱0.00</span>
      </div>
      <div className="ad-summary-row ad-total-row">
        <span>
          <strong>Total Amount:</strong>
        </span>
        <span>
          <strong>₱35.00</strong>
        </span>
      </div>
    </div>
  </div>
);

// Combined card for customer, delivery, notes, and product sections
const OrderDetailsCard = ({ order }) => (
  <div className="ad-detail-section ad-order-details-card">
    {/* Customer Section */}
    <div className="ad-customer-section">
      <h3 className="ad-section-title">Customer</h3>
      <div className="ad-customer-info">
        <span>
          <strong>Name:</strong> {order.name}
        </span>
        <span>
          <strong>Phone:</strong> +639994563218
        </span>
        <span>
          <strong>Email:</strong> {order.name.toLowerCase().replace(" ", "")}
          @gmail.com
        </span>
      </div>
    </div>

    <div className="ad-detail-sections-row">
      <DeliveryDetailsSection order={order} />
      <NotesSection />
    </div>
    <ProductSection order={order} />
  </div>
);

const OrderDetailView = ({
  order,
  onBack,
  sourcePage = "Live Orders",
  onNavigate,
}) => {
  const getBreadcrumbPath = () => {
    switch (sourcePage) {
      case "Order History":
        return { path: "/admin-orderhistory", label: "Order History" };
      case "Sales":
        return { path: "/admin-sales", label: "Sales" };
      default:
        return { path: "/admindashboard", label: "Live Orders" };
    }
  };

  const breadcrumbPath = getBreadcrumbPath();

  return (
    <div className="ad-order-detail-view">
      <div className="ad-order-detail-header">
        <div className="ad-breadcrumb">
          <span
            className="ad-breadcrumb-item clickable"
            onClick={() => onNavigate(breadcrumbPath.path)}
          >
            {breadcrumbPath.label}
          </span>
          <span className="ad-breadcrumb-separator">&gt;</span>
          <span className="ad-breadcrumb-item">Orders</span>
        </div>
        <h2 className="ad-order-title">Order {order.id}</h2>
      </div>

      <div className="ad-order-detail-content">
        {/* Combined Order Details Card */}
        <OrderDetailsCard order={order} />
      </div>
    </div>
  );
};

export default OrderDetailView;

// Export individual components for potential reuse
export {
  CustomerCard,
  OrderDetailsCard,
  DeliveryDetailsSection,
  NotesSection,
  ProductSection,
};
