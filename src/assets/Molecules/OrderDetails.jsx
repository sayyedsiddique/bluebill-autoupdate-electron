import { Table } from 'react-bootstrap';
import PaymentType from '../Components/Atoms/PaymentType';
import DeliveryStatus from '../Components/Atoms/DeliveryStatus';

const OrderDetails = () => {

  const CustomerOrderDetails =[
    {orderId:"1",name:"farrukh",date:"today",item:"2",payment:"COD",status:"pending",amount:"3000"},
    {orderId:"1",name:"farrukh",date:"today",item:"2",payment:"COD",status:"pending",amount:"3000"},
   
  ]
  const renderOrderDetails =(customer,index)=>{
    return(
      <tr key={index}>
        <td>{customer.orderId}</td>
        <td>{customer.name}</td>
        <td>{customer.date}</td>
        <td>{customer.item}</td>
        <td><PaymentType>COD</PaymentType></td>
        <td><DeliveryStatus>pending</DeliveryStatus></td>
        <td>{customer.amount}</td>
      </tr>
    )
  }
  return (

    <div >
    < Table responsive="sm" striped bordered hover variant="light">
    <thead>
      <tr>
        <th>OrderID</th>
        <th>Customer</th>
        <th>Date</th>
        <th>Item</th>
        <th>Payment</th>
        <th>DelivaryStatus</th>
        <th>Amount</th>
      </tr>
    </thead>
    <tbody>
     {CustomerOrderDetails.map(renderOrderDetails)}
    </tbody>
  </Table>
  </div>
  )
}

export default OrderDetails;