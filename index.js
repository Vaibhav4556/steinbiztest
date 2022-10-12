import express, { json } from "express";
import fetch from "node-fetch";

const app = express();
const PORT = 7000;
app.use(json());

app.get("/", (request, response) => {
  response.send("!! Welcome To Currecncy Exchange !!");
});

app.get("/exchange", async (request, response) => {
  // storing user entered currency
  const { value, userCurrency } = request.body;
  //console.log(value,userCurrency)

  //featching INR exchange rates 
  const allCurrency = await fetch("https://open.er-api.com/v6/latest/INR")
    .then((res) => res.json())
    .then((curr) => curr.rates);
    //console.log(allCurrency)
  const rate = allCurrency[userCurrency];
 // console.log(rate)
  
  //Finding the INR to Usercurrency Exchange rate and storing as Result
    const exchangeRate = `RS ${value} is equal to ${rate * value} ${userCurrency}`;
    console.log({"exchangeRate":exchangeRate})

  //Featching INR to BTC Using wazirx API
  const btcinr = await fetch("https://api.wazirx.com/sapi/v1/tickers/24hr")
    .then((res) => res.json())
    .then((curr) => curr[0]);
     //console.log(btcinr)
  // Updating the values for the Exchange Rates against the indian Rupee.
  btcinr.symbol = `BTC${userCurrency}`;
  btcinr.baseAsset = "BTC";
  btcinr.quoteAsset = `${userCurrency}`;
  btcinr.openPrice = +btcinr.openPrice * rate;
  btcinr.lowPrice = +btcinr.lowPrice * rate;
  btcinr.highPrice = +btcinr.highPrice * rate;
  btcinr.lastPrice = +btcinr.lastPrice * rate;
  btcinr.bidPrice = +btcinr.bidPrice * rate;
  btcinr.askPrice = +btcinr.askPrice * rate;

  // Combining all the results into one oject
  const result = { exchangeRate: exchangeRate, ...btcinr };

  // Sending responce to user
  response.send(result);
  
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
