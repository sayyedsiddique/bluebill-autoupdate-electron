import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { validateLicense } from "../utils/constantFunctions";

const useLicenseValidation = () => {
  const validLicenseDetailsData = useSelector(
    (state) => state.license.validateLicenseDetails
  );
  const currentTimeInUTC = useSelector((state) => state.license.currentTime);
  const [isLicenseValid, setIsLicenseValid] = useState();
  // console.log("isLicenseValid... ", isLicenseValid);
  console.log("validLicenseDetailsData... ", validLicenseDetailsData);

  useEffect(() => {
    // Sample timestamps
    var createdTimestamp = new Date(currentTimeInUTC?.currentTime).getTime();
    var expiryTimestamp = new Date(validLicenseDetailsData?.expiry).getTime();

    // Calculate the time difference in milliseconds
    var timeDifference = expiryTimestamp - createdTimestamp;
    // Convert milliseconds to days
    var daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    // console.log("daysDifference... ", daysDifference);

    const validateLicenseDetails = () => {
      // Your license validation logic goes here
      if (validLicenseDetailsData?.name === "lifeTime") {
        let newObj = {
          ...validLicenseDetailsData,
          licensePlan: validLicenseDetailsData?.name,
        };
        newObj && setIsLicenseValid(newObj);
      } else {
        const validate = validateLicense(
          currentTimeInUTC?.currentTime,
          validLicenseDetailsData?.expiry,
          validLicenseDetailsData?.name
        );

        let newObj = {
          ...validate,
          LeftDays: daysDifference,
          licensePlan: validLicenseDetailsData?.name,
        };
        newObj && setIsLicenseValid(newObj);
      }
    };

    // Call the validation function when the relevant dependencies change
    validateLicenseDetails();
  }, [validLicenseDetailsData, currentTimeInUTC]);

  return isLicenseValid;
};

export default useLicenseValidation;
