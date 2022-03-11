require("dotenv").config({
  path: ".env",
})

const { PrintfulClient } = require("printful-request")

const printful = new PrintfulClient(process.env.PRINTFUL_API_KEY)

const recipient = {
  address1: "54 boulevard Aristide Briand",
  city: "Le Bouscat",
  state_code: null,
}

const items = [
  {
    external_variant_id: "6217c962974c92",
    quantity: 2,
  },
  {
    external_variant_id: "6217c962974e43",
    quantity: 1,
  },
]
function getShippingRate() {
  printful
    .post("/shipping/rates", {
      recipient,
      items,
      currency: "USD",
      locale: "en_US",
    })
    .then((response) => {
      console.log(response)
    })
    .catch((e) => console.error(e))
}

// getShippingRate()

function getCountries() {
  printful.get("countries").then((res) => {
    const data = res.result
    console.log(data)
  })
}

getCountries()
