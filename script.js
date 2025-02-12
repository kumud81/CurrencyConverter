document.addEventListener("DOMContentLoaded", () => {
  
const BASE_URL = "https://api.exchangerate-api.com/v4/latest"; // Updated to the new API

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// Dynamically populate dropdowns
for (let select of dropdowns) {
  for (currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;

    // Default selections
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = "selected";
    }
    select.append(newOption);
  }

  //to update the flag 
  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

const updateExchangeRate = async () => {
  let amount = document.querySelector(".amount input");
  let amtVal = amount.value;

  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
    amount.value = "1";
  }

  //modify the BASE_URL of the currency exchange API 
  //on the basis of what user selects from the dropdown options
  const URL = `${BASE_URL}/${fromCurr.value}`;

  try {
    let response = await fetch(URL);   //fetch(URL) is used to make an HTTP request to the constructed URL.
    //await pauses the function until the fetch request is resolved (either successful or failed).

    // Check if the response is successful
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    let data = await response.json();  //.json() is a method that parses the response body as JSON.
    //await is used again to wait for the parsing to complete.
    //data now holds the parsed JavaScript object containing the exchange rate data.

    let rate = data.rates[toCurr.value];  //data.rates[toCurr.value] accesses the exchange rate for that currency.
    //Ex: If toCurr.value is "INR", then rate becomes 83.50.
    
    // Check if the expected currency data exists
    if (!rate) {
      throw new Error("Exchange rate data not found!");
    }
    
    //calculating the final amount
    let finalAmount = (amtVal * rate).toFixed(2); //.toFixed(2) rounds the result to 2 decimal places.

    //dispalaying the result
    msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
    //ex: 10 USD = 86.23 INR

  } 
  
  catch (error) {  //catch (error) handles any errors thrown in the try block.
    console.error("Error fetching exchange rate:", error);
    msg.innerText = "Error fetching exchange rate. Try again later.";
  }

};

const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode]; //Retrieves the corresponding country code for the selected currency.

  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

//Add event listener to button
btn.addEventListener("click", (evt) => {
  evt.preventDefault(); //preventDefault() stops or prevents the page to reload, keeping the SPA (Single Page Application) feel.
  updateExchangeRate();
});

//Call this once on page load to show initial rate
// window.addEventListener("load", () => {
//   updateExchangeRate();
// });

updateExchangeRate();

});
