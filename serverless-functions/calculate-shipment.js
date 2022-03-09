require("dotenv").config({
  path: ".env",
})

const { PrintfulClient } = require("printful-request")

const printful = new PrintfulClient(process.env.PRINTFUL_API_KEY)

exports.handler = async (event) => {
  const { formData, items } = JSON.parse(event.body)

  const { address1, city, country_code, state_code, zip } = formData

  const payload = {
    recipient: { address1, city, country_code, state_code, zip },
    items: items.map((i) => ({
      external_variant_id: i.external_id,
      quantity: i.quantity,
    })),
    currency: "USD",
    locale: "en_US",
  }
  console.log(payload)

  try {
    const shippingQuote = await printful.post("/shipping/rates", payload)
    console.log(shippingQuote)
  } catch (e) {
    console.error(e)
  }

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      shipping: "ok",
    }),
  }
}

// function getShippingRate() {
//   printful
//     .post("/shipping/rates", {
//       recipient,
//       items,
//       currency: "USD",
//       locale: "en_US",
//     })
//     .then((response) => {
//       console.log(response)
//     })
//     .catch((e) => console.error(e))
// }
