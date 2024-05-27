import React from "react";
import "./RecentOrder.css";

const RecentOrder = () => {
  return (
    <div className="row ms-0">
    <div className="col-12 recentOrderContainer">
      <div className="recentOrders">
        <div className="recentHeading mb-4">
          <h2 className="text-heading">Recent Orders</h2>
        </div>
      </div>
      <div className="table-responsive">
      <table class="table">
        <thead>
          <tr>
            <th className="col table-lable  ">Name</th>
            <th className="col">Price</th>
            <th className="col">Payment</th>
            <th className="col">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Sonu</td>
            <td>$1200</td>
            <td>Paid</td>
            <td>
              <span className="status delivered">Delivered</span>
            </td>
          </tr>
          <tr>
            <td>Majed</td>
            <td>$850</td>
            <td>Due</td>
            <td>
              <span className="status pending">Pending</span>
            </td>
          </tr>
          <tr>
            <td>Siddique</td>
            <td>$1500</td>
            <td>Due</td>
            <td>
              <span className="status inprogress">In Progress</span>
            </td>
          </tr>
          <tr>
            <td>Siddique</td>
            <td>$1500</td>
            <td>Due</td>
            <td>
              <span className="status inprogress">In Progress</span>
            </td>
          </tr>
          <tr>
            <td>Siddique</td>
            <td>$1500</td>
            <td>Due</td>
            <td>
              <span className="status inprogress">In Progress</span>
            </td>
          </tr>
          <tr>
            <td>Siddique</td>
            <td>$1500</td>
            <td>Due</td>
            <td>
              <span className="status inprogress">In Progress</span>
            </td>
          </tr>
          <tr>
            <td>Siddique</td>
            <td>$1500</td>
            <td>Due</td>
            <td>
              <span className="status inprogress">In Progress</span>
            </td>
          </tr>
          <tr>
            <td>Siddique</td>
            <td>$1500</td>
            <td>Due</td>
            <td>
              <span className="status inprogress">In Progress</span>
            </td>
          </tr>
        </tbody>
      </table>
      </div>
    </div>
    </div>
  );
};

export default RecentOrder;
