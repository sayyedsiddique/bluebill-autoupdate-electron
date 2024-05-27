import React, { useState } from "react";
import "./BluetoothPrinter.css";
import DevicePair from "./AvaialableDevices";
import PairedDevices from "./PairedDevices";

const BluetoothPrinter = () => {
  const [printerDevice, setPrinterDevice] = useState(null);
  const [connected, setConnected] = useState(false);
  const [output, setOutput] = useState("");

  // Find the bluetooth devices handler
  const requestPrinterDevice = async () => {
    try {
      // Request permission to access Bluetooth devices
      const device = await navigator.bluetooth.requestDevice({
        // filters: [{ services: ['serial_port'] }], // Use the service UUID or name provided by your printer
        acceptAllDevices: true,
      });
      console.log("device... ", device);
      setPrinterDevice(device);
      setConnected(false); // Reset connection status
    } catch (error) {
      console.error("Error requesting printer device:", error);
    }
  };

  // Connect to Printer Handler
  const connectToPrinter = async () => {
    if (!printerDevice) {
      console.error("No printer device selected.");
      return;
    }

    try {
      // Connect to the selected printer device
      const server = await printerDevice.gatt.connect();
      // Get the serial port service provided by the printer
      // const service = await server.getPrimaryService("serial_port");
      // // Get the characteristic for writing data to the printer
      // const characteristic = await service.getCharacteristic("write");
      // setConnected(true);
      // console.log("Connected to printer:", printerDevice);
      // // You can now send data to the printer through the characteristic
      // // For example, to send text to the printer:
      // const text = "Hello, printer!";
      // await characteristic.writeValue(new TextEncoder().encode(text));
      // setOutput(`Sent text to printer: ${text}`);
    } catch (error) {
      console.error("Error connecting to printer:", error);
    }
  };

  const printHanlder = async () => {
    if (!printerDevice) {
      console.error("Printer is not connected.");
      return;
    }

    try {
      // Connect to the selected printer device
      const server = await printerDevice.gatt.connect();
      // Get the serial port service provided by the printer
      const service = await server.getPrimaryService("serial_port");
      // Get the characteristic for writing data to the printer
      const characteristic = await service.getCharacteristic("write");
      setConnected(true);
      console.log("Connected to printer:", printerDevice);
      // You can now send data to the printer through the characteristic
      // For example, to send text to the printer:
      const text = "Hello, printer!";
      await characteristic.writeValue(new TextEncoder().encode(text));
      setOutput(`Sent text to printer: ${text}`);
      // Additional print commands can be sent as needed
    } catch (error) {
      console.error("Error printing:", error);
    }
  };

  return (
    <div className="bluetoothPrinterContainer">
      <h1>Bluetooth Printer</h1>
      <div className="scanPrinterContainer">
        <p>Bluetooth Printer</p>
        <span onClick={requestPrinterDevice}>Scan For NearBy Printer</span>
      </div>

      <div className="availableDeviceContainer mb-3">
        <p>Paired Device</p>

        <div className="devicesContainer">
          <PairedDevices
            printerName={"Printer001"}
            printerId={"22134B67-D844-16AF-7B8C-5D4B9818E744"}
            pairHandler={printHanlder}
          />
        </div>
      </div>

      <div className="availableDeviceContainer">
        <p>Available Devices</p>

        <div className="devicesContainer">
          <DevicePair
            printerName={"Printer001"}
            printerId={"22134B67-D844-16AF-7B8C-5D4B9818E744"}
            pairHandler={connectToPrinter}
          />
          <DevicePair
            printerName={"Printer002"}
            printerId={"22134B67-D844-16AF-7B8C-5D4B9818E744"}
            pairHandler={connectToPrinter}
          />
        </div>
      </div>
    </div>
  );
};

export default BluetoothPrinter;
