require("dotenv").config({
  path: ".env",
})

const { PrintfulClient } = require("printful-request")

const printful = new PrintfulClient(process.env.PRINTFUL_API_KEY)

exports.handler = async (event) => {
  const { formData } = JSON.parse(event.body)

  const { country_code, state_code, city, zip } = formData

  const payload = {
    recipient: { country_code, state_code, city, zip },
  }

  let data
  try {
    data = await printful.post("/tax/rates", payload)
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
