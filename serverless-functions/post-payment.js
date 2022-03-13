const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)
const { PrintfulClient } = require("printful-request")

const printful = new PrintfulClient(process.env.PRINTFUL_API_KEY)

/**
 * 1. Look up stripe payment intent
 * 2. Get printful order ID from payment metadata
 * 3. Get printful order data to display in confirmation screen
 * 3. Set printful order status to pending -- (Only when site is live)
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

async function getPrintfulOrder(printfulOrderId) {
  const { result } = await printful.get(`orders/${printfulOrderId}`)
  return result
}

async function confirmPrintfulOrder(printfulOrderId) {
  const { result } = await printful.post(`orders/${printfulOrderId}/confirm`)
  return result
}

exports.handler = async (event) => {
  const { payment_intent } = JSON.parse(event.body)

  const stripePaymentIntent = await getStripePaymentIntent(payment_intent)

  // TODO: send this data to UI for order confirmation page
  const printfulOrder = await getPrintfulOrder(
    stripePaymentIntent.metadata.orderId
  )

  // Billing must be set up to connect to Stripe in printful, otherwise these orders fail
  const confirmOrder = await confirmPrintfulOrder(
    stripePaymentIntent.metadata.orderId
  )

  return {
    statusCode: 200,
  }
}
