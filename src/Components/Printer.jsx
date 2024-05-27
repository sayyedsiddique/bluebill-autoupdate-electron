import React, { useEffect, useRef } from "react";
import ReactToPrint from "react-to-print";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { Button } from "@mui/material";
import { getUnitList } from "../Redux/Unit/unitSlice";
import { useDispatch, useSelector } from "react-redux";

const studendData = [
  {
    id: 1,
    name: "Neeraj",
    email: "sayyedsiddique@gmail.com",
    year: 2015,
    fee: 16700,
  },
  {
    id: 1,
    name: "Neeraj",
    email: "sayyedsiddique@gmail.com",
    year: 2015,
    fee: 16700,
  },
  {
    id: 1,
    name: "Neeraj",
    email: "sayyedsiddique@gmail.com",
    year: 2015,
    fee: 16700,
  },
  {
    id: 1,
    name: "Neeraj",
    email: "sayyedsiddique@gmail.com",
    year: 2015,
    fee: 16700,
  },
];

const Printer = () => {
  const columns = [
    { title: "name", field: "name" },
    { title: "email", field: "email" },
    { title: "year", field: "year", type: "numeric" },
  ];
  const componentRef = useRef();
  const dispatch = useDispatch();
  const unitData = useSelector((state) => state.unit.unitData);

  // console.log("unitData ", unitData);

  // initial APIs Call
  useEffect(() => {
    dispatch(getUnitList(0, 0, ""));
  }, []);

  const downloadPDFHandler = () => {
    // Default export is a4 paper, portrait, using millimeters for units
    const doc = new jsPDF();
    console.log("PDF chala");

    doc.text("Hello world!", 10, 10);
    doc.autoTable({
      // columnStyles: { europe: { halign: 'center' } }, // European countries centered
      columns: columns.map((item) => ({ ...item, dataKey: item.field })),
      body: studendData,
    });

    doc.save("Transactions details.pdf");
  };

  return (
    <div>
      <ReactToPrint
        trigger={() => (
          <Button
            variant="contained"
            style={{ background: "var(--main-bg-color)" }}
            // onClick={downloadPDFHandler}
          >
            {"Print"}
          </Button>
        )}
        content={() => componentRef.current}
        pageStyle="print"
        documentTitle="eZygen Technology"
        bodyClass="printer"
        onAfterPrint={() => console.log("document printed!")}
      />
      <div className="mt-2" style={{ textAlign: "right" }}>
        <Button
          variant="contained"
          style={{ background: "var(--main-bg-color)" }}
          onClick={downloadPDFHandler}
        >
          {"Download PDF"}
        </Button>
      </div>
      <div ref={componentRef} className="row ms-0">
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
    </div>
  );
};

export default Printer;
