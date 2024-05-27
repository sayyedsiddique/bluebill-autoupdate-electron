
const { ipcRenderer } = require('electron')

window.addEventListener('DOMContentLoaded', () => {
    let emailInput = document.getElementById("email");
    let licenseKeyInput = document.getElementById("licenseKey");
    let submitBtnElement = document.getElementById("submitBtn")
    
    // var inputData = [];
    let inputValuesObj = { emailValue: "", licenseValue: "" }
    
    const onchangeHandler = (e) => {
        const value = e.target.value
        const name = e.target.name
        if(name === "email"){
            inputValuesObj.emailValue = value
        }else if(name === "license"){
            inputValuesObj.licenseValue = value
        }
        console.log("value... ", value)
        console.log("name... ", name)
    }
    // Storevalues in an object

    
    emailInput.addEventListener("change", onchangeHandler)
    licenseKeyInput.addEventListener("change", onchangeHandler)

    submitBtnElement.addEventListener("click", () => {
        ipcRenderer?.send('GATE_SUBMIT', inputValuesObj)
    })
})



// function validateInputs() {
//     clearErrorMessages();

//     var email = emailInput.value;
//     var licenseKey = licenseKeyInput.value;

//     // Email validation
//     var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!email === undefined || email === "") {
//         showError("email", "Please enter email address");
//         return;
//     } else if (!emailRegex.test(email)) {
//         showError("email", "Please enter a valid email address");
//         return;
//     }
//     // License key validation
//     if (!licenseKey || licenseKey === "") {
//         showError("licenseKey", " Please enter license key");
//         return;
//     }

//     inputData.push({ email: email, licenseKey: licenseKey });


//     emailInput.value = "";
//     licenseKeyInput.value = "";

//     console.log("formDetails:", inputData);
// }

function showError(field, message) {
    // document.getElementById(field + "Error").textContent = message;
}

function clearErrorMessages() {
    // document.getElementById("emailError").textContent = "";
    // document.getElementById("licenseKeyError").textContent = "";
}

// Clear error messages
// emailInput.addEventListener("input", function () {
//     clearErrorMessages();
// });


// licenseKeyInput.addEventListener("input", function () {
//     clearErrorMessages();
// });
