import React from 'react'
import "./PricingPage.css";
import { fileSharingData } from '../../Containts/Values'

const FileSharingTableSection = () => {
  return (
    <>
    {fileSharingData.map((row, index) => (
      <tr key={index}>
        <td className='table-hd' style={{borderLeft:"none"}}>{row.feature}</td>
        <td>{row.free}</td>
        <td>{row.lifeTime}</td>
        {/* <td style={{borderRight:'none'}}>{row.ultimate}</td> */}
      </tr>
    ))}
  </>
  )
}

export default FileSharingTableSection
