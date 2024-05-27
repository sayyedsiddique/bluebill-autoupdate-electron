import { Alert, Snackbar } from '@mui/material';
import React from 'react';

function AlertpopUP({ open, message, severity, onClose }) {
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    if (onClose) {
      onClose();
    }
  };

  const getAlertBackgroundColor = () => {
    switch (severity) {
      case 'error':
        return '#FF3333'; // red
      case 'success':
        return '#51C35D'; // green
      default:
        return '#51C35D'; // blue as default
    }
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert
        onClose={handleClose}
        severity={severity}
        variant="filled"
        sx={{
          width: '100%',
          maxWidth: '425px',
          marginTop: '4rem',
          backgroundColor: getAlertBackgroundColor(),
          '@media (max-width: 425px)': {
            width: '83%'
          },
          '@media (max-width: 375px)': {
            width: '80%'
          }
        }}
      >
        {message}
      </Alert>


    </Snackbar >
  );
}

export default AlertpopUP;



// autoHideDuration = 3000

// import { useState } from "react";
// import { Toast } from 'react-bootstrap';

// const AlertpopUP = ({ isOpen, setIsOpen, msg }) => {

//     const [show, setShow] = useState(true);

//     if (!isOpen) {
//         return null;
//     }

//     // console.log(isOpen);
//     // console.log(setIsOpen);
//     // console.log(msg);

//     return (
//         <div >

//             <Toast onClose={() => setShow(false)} show={show} style={{ "opacity": "1" }} >
//                 <div className="toast align-items-center p-2 " role="alert" aria-live="assertive" aria-atomic="true" style={{ "opacity": "1" }}>
//                     <div className="d-flex">
//                         <div className="toast-body fw-bold">
//                             {msg}
//                         </div>
//                         <button onClick={() => (setShow(false))(setIsOpen(false))} type="button" className="btn-close me-2 m-auto" data-dismiss="toast" aria-label="Close"></button>
//                     </div>
//                 </div>
//             </Toast>

//         </div>

//     );
// };
// export default AlertpopUP;


