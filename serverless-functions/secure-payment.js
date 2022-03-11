const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)
const { PrintfulClient } = require("printful-request")

const printful = new PrintfulClient(process.env.PRINTFUL_API_KEY)

exports.handler = async (event) => {
  const { items, selectedShipping, recipient } = JSON.parse(event.body)

  const paymentIntent = await stripe.paymentIntents.create({
    currency: "USD",
    automatic_payment_methods: {
      enabled: true,
    },
  })

  return {
    statusCode: 200,
    body: JSON.stringify({
      clientSecret: paymentIntent.client_secret,
    }),
  }
}
