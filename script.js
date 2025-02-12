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

  const URL = `${BASE_URL}/${fromCurr.value}`;

  try {
    let response = await fetch(URL);

    // Check if the response is successful
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    let data = await response.json();
    let rate = data.rates[toCurr.value];

    // Check if the expected currency data exists
    if (!rate) {
      throw new Error("Exchange rate data not found!");
    }

    let finalAmount = (amtVal * rate).toFixed(2);
    msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
  } catch (error) {
    console.error("Error fetching exchange rate:", error);
    msg.innerText = "Error fetching exchange rate. Try again later.";
  }
};

const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

// ✅ Add event listener to button
btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

// ✅ Call this once on page load to show initial rate
window.addEventListener("load", () => {
  updateExchangeRate();
});

// updateExchangeRate();

});