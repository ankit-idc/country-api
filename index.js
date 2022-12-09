require("dotenv").config();
const express = require("express");
const cors = require("cors");

const countries = require("./countries.json");

const app = express();

app.use(cors("*"));

app.get("/country", (req, res) => {
  try {
    const countryList = [];
    for (let country of countries) {
      countryList.push({
        id: country.id,
        name: country.name,
        emoji: country.emoji,
      });
    }
    res.send(countryList);
  } catch (err) {
    res.status(500).send([]);
  }
});

app.get("/state/:country_name", (req, res) => {
  try {
    const countryName = req.params.country_name;
    let selectedCountry = {};

    //not using arr.find method for optimisation.
    for (let country of countries) {
      if (country.name === countryName) {
        selectedCountry = country;
        break;
      }
    }

    if (!selectedCountry.name) {
      return res.send([]);
    }

    return res.send(
      selectedCountry?.states?.map((state) => ({
        name: state.name,
        id: state.id,
        state_code: state.state_code,
      }))
    );
  } catch (err) {
    res.status(500).send([]);
  }
});

app.get("/city/:state_name/:country_name", (req, res) => {
  try {
    const countryName = req.params.country_name;
    const stateName = req.params.state_name;
    let selectedCountry = {};
    let selectedState = {};

    //not using arr.find method for optimisation.
    for (let country of countries) {
      if (country.name === countryName) {
        selectedCountry = country;
        break;
      }
    }

    if (!selectedCountry.name) {
      return res.send([]);
    }

    //not using arr.find method for optimisation.
    for (let state of selectedCountry.states) {
      if (state.name === stateName) {
        selectedState = state;
        break;
      }
    }

    if (!selectedState.name) {
      return res.send([]);
    }

    res.send(
      selectedState.cities.map((city) => ({ id: city.id, name: city.name }))
    );
  } catch (err) {
    res.status(500).send([]);
  }
});

const PORT = process.env.PORT;
app.listen(PORT, () => console.log("server running at port ", PORT));
