baseURL = "https://latest.currency-api.pages.dev/v1/currencies";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector(".convert button");
const fromCurrency = document.querySelector(".from select");
const toCurrency = document.querySelector(".to select");
const exchangeIcon = document.querySelector(".dropdown i");

for (let select of dropdowns) {      
    for (currCode in countryList) {
        let newOption = document.createElement("option");
        newOption.innerText = currCode;
        newOption.value = currCode;
        if (select.name === "from" && currCode  === "USD") {
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

const updateFlag = (element) => {
    let currCode = element.value; //getting currency code like 'USD'
    let countryCode = countryList[currCode]; //getting country code like 'US' from countryList object
    let newSrc = `https://flagsapi.com/${countryCode}/shiny/64.png`; //constructing url for flag image
    let img = element.parentElement.querySelector("img");  //selecting img tag of particular dropdown
    img.src = newSrc;   //updating flag image source
}

//for exchanging the currencys and flags
exchangeIcon.addEventListener("click", () => {
    let temp = fromCurrency.value;
    fromCurrency.value = toCurrency.value;
    toCurrency.value = temp;
    updateFlag(fromCurrency);
    updateFlag(toCurrency);
});

//default conversion on page load
window.addEventListener("load", () => {
    btn.click();
});

btn.addEventListener("click", async (evt) => {
    evt.preventDefault();  // it is use to prevent form from submitting

    if(window.navigator.vibrate && evt.isTrusted) { //checking if vibration api is supported and event is trusted
        window.navigator.vibrate(20); //vibration api for tactile feedback on button click for 20 milliseconds
    }

    let amount = document.querySelector(".value input");
    let amtVal = amount.value;
    if (amtVal === "" || amtVal < 1) {
        amtVal = 1;
        amount.value = "1";
    }

    //disable the button until we get the exchange rate
    btn.innerText = "Fetching Rate...";
    // btn.style.opacity = 0.7;
    btn.disabled = true;

    const fromCurr = fromCurrency.value.toLowerCase();
    const toCurr = toCurrency.value.toLowerCase();
    const URL = `${baseURL}/${fromCurr}.json`; //constructing url for fetch api. in old api it was like .../usd/inr.json but in new api it is .../usd.json
    try {
        let response = await fetch(URL);
        let data = await response.json();
        let rate = data[fromCurr][toCurr]; //getting exchange rate from the fetched data
        let finalAmount = (amtVal * rate).toFixed(2); //calculating final amount after conversion. and fixing it to 2 decimal places
        const msg = document.querySelector(".msg");
        msg.innerText = `${amtVal} ${fromCurrency.value} = ${finalAmount} ${toCurrency.value}`; //displaying the result
    } catch (error) {
        console.error("Error:", error);
        const msg = document.querySelector(".msg");
        msg.innerText = "Please Try Again Later, Failed to fetch data.";
    }

    //enable the button after getting the exchange rate
    btn.innerText = "Convert";
    // btn.style.opacity = 1;
    btn.disabled = false;
});

//adding 'enter' key functionality to the input field
document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        btn.click();
    }
});