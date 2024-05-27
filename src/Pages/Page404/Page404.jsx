import { Button } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const Page404 = () => {
    const navigate=useNavigate()
  return (
    <div className="d-flex align-items-center justify-content-center vh-100">
            <div className="text-center">
                <h1 className="display-1 fw-bold">404</h1>
                <p className="fs-3"> <span className="text-danger">Opps!</span> Page not found.</p>
                <p className="lead">
                    The page you’re looking for doesn’t exist.
                  </p>
                  <Button
                    variant="contained"
                    onClick={()=>navigate("/")}
                    style={{
                      backgroundColor: "var(--button-bg-color)",
                      color: "var(--button-color)",
                      marginTop: 5,
                      marginBottom: 5,
                    }}
                  >
                    Go Home
                  </Button>
            </div>
        </div>
  )
}

export default Page404