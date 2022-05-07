const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)
const { PrintfulClient } = require("printful-request")

const printful = new PrintfulClient(process.env.PRINTFUL_API_KEY)

/**
 * 1. Look up stripe payment intent
 * 2. Get order data from metadata
 * 3. Create order
 * 4. On error: return error message
 * 5. On success: return Order confirmation data
 *   - Thank you, "customer"
 *   - Line items / Prices + quantities
 *   - Email confirmation?
 */

async function getStripePaymentIntent(paymentIntentId) {
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
  return paymentIntent
}

async function createPrintfulOrder(orderData) {
  const { result } = await printful.post(`orders`, orderData)
  return result
}

exports.handler = async (event) => {
  const { payment_intent } = JSON.parse(event.body)

  const stripePaymentIntent = await getStripePaymentIntent(payment_intent)
  const orderData = JSON.parse(stripePaymentIntent.metadata.orderPayload)

  console.log("ORDER D", orderData)

  // TODO: send this data to UI for order confirmation page
  const printfulOrder = await createPrintfulOrder(orderData)

  return {
    statusCode: 200,
    body: JSON.stringify({ printfulOrder }),
  }
}
