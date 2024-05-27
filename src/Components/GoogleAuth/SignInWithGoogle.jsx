import React from 'react'
import { GoogleLogin } from '@react-oauth/google';

const SignInWithGoogle = (props) => {


  return (
    <GoogleLogin
    onSuccess={credentialResponse => {
        props.successHandler(credentialResponse);
    }}
    onError={() => {
        props.ErrorHandler()
    }}
  />
  )
}

export default SignInWithGoogle