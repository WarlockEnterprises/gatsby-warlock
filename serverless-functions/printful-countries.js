require("dotenv").config({
  path: ".env",
})

const { PrintfulClient } = require("printful-request")

const printful = new PrintfulClient(process.env.PRINTFUL_API_KEY)

exports.handler = async (event) => {
  const { result } = await printful.get("countries")

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      countries: result,
    }),
  }
}
