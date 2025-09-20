import React, { useMemo } from 'react'
import '../../styles/employee/employee-shared.css'

const OrderManagement = ({ onBack }) => {
  const orders = useMemo(() => JSON.parse(localStorage.getItem('brewCraftOrders') || '[]'), [])

  return (
    <div className="emp-page">
      <div className="emp-container">
        <div className="emp-header">
          <button className="back-btn" onClick={onBack}>Back</button>
          <h1 className="emp-title">Order Management</h1>
        </div>

        <div className="emp-list">
          {orders.map((o, idx) => (
            <div className="emp-row" key={o.orderId || idx}>
              <div className="emp-row-main">
                <strong>Order {o.orderId}</strong>
                <span className="muted">Items: {o.items?.reduce((t,i)=>t+i.quantity,0)} • Total: ₹{o.total?.toLocaleString()}</span>
              </div>
            </div>
          ))}
          {orders.length === 0 && <div className="muted">No orders yet.</div>}
        </div>
      </div>
    </div>
  )
}

export default OrderManagement



