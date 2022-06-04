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

  let data
  try {
    data = await printful.post("/shipping/rates", payload)
  } catch (e) {
    data = e
  }

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }
}
