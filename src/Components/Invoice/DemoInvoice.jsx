
import './ThermalSmallInvoice.css'
import './DemoInvoice.css'
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { DemoInvoiceProduct } from '../../Containts/Values';
import { DemoInvoiceDetails } from '../../Containts/Values';

const DemoInvoice = ({ style, height, width }) => {
    const { t } = useTranslation();
    console.log("style", style);

    function formatDate(date) {
        return format(date, 'dd-MM-yyyy');
    }
    console.log("DemoInvoiceDetails", DemoInvoiceDetails);

    return (
        <div className=' small-invoice-container d-flex flex-column justify-content-between' style={{ width: ` ${width}px `, height: ` ${height}px ` }}>
            <h5 className=' text-center invoice-name-heading'>Invoice</h5>
            {/* <hr /> */}
            <div className='pe-1 ps-1 date-and-time-container d-flex justify-content-between'>

                <p className='date-and-time'>Date : {formatDate(new Date())}</p>
                <p className="">Time : {new Date().toLocaleTimeString()}</p>

            </div>
            <hr />
            <div className=' pe-1 ps-1 termal-customerName d-flex justify-content-between'>
                <p
                // className={style === "labelDemoInvocieStyle" ? "labelDemoInvocieStyle" : "labelDemoInvocieStyle1"}
                >
                    CustomerName : {DemoInvoiceDetails[0].customerName}
                </p>
                <p>
                    SalesExecutive :{DemoInvoiceDetails[0].saleExecutive}
                </p>


            </div>
            <hr></hr>
            <div className='thermal-address'>
                <p
                >To, Islampura baba chowk<br />
                    Beed,
                    Maharashtra ,
                    Ph: 982221232425
                </p>
            </div>
            <hr />
            <table>
                <thead className='thermal-thead'>
                    <tr>
                        <th>Sr.</th>
                        <th style={{ textAlign: "left" }}>ProductName</th>
                        <th>Qty</th>
                        <th>Rate</th>
                        <th>Amount</th>
                    </tr>
                </thead>

                <tbody className='thermal-details'>
                    {DemoInvoiceProduct.map((product, index) => {
                        return (

                            <tr>
                                <td>{index + 1}</td>
                                <td style={{ textAlign: "left" }}>{product.productName}</td>
                                <td>{product.quantity}</td>
                                <td>{product.rate}</td>
                                <td>{product.amount}</td>

                            </tr>
                        )

                    })}

                </tbody>
            </table>
            <hr />
            <div className='pe-1 ps-1 thermal-subtotal-container d-flex justify-content-between '>
                <p
                >Subtotal</p>
                <p>{DemoInvoiceDetails[0].subtotal}</p>
            </div>

            <div className="pe-1 ps-1 total-amount-container d-flex justify-content-between ">
                <p
                >Total Amount</p>
                <p>{DemoInvoiceDetails[0].totalAmount}</p>
            </div>
            <div className="thankyou-container text center">
                <p className='nice-day'>Have a Nice Day</p>
                <p>Thanks for your kind visit</p>
            </div>


        </div>
    )
}

export default DemoInvoice