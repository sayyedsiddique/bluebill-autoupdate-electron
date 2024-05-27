import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  componentDidCatch(error, errorInfo) {
    console.log(error, errorInfo)
    this.setState({ hasError: true, error: error, errorInfo: errorInfo});
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h2 className='text-center text-danger fw-bolder'>Oops, something went wrong :( </h2>
          <p className='text-center fw-bold'>The error: {this.state.error && this.state.error.toString()}</p>
          {/* <div>Where it occured: {this.state.errorInfo && this.state.errorInfo.componentStack}</div> */}
        </div>
      );
      
    }

    return this.props.children;
  }
}

export default ErrorBoundary;


