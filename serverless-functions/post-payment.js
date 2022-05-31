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

// Create printful order using paymentIntentId to prevent duplicates
async function createPrintfulOrder(orderData, paymentIntentId) {
  const { result } = await printful.post(`orders`, {
    ...orderData,
    external_id: paymentIntentId,
  })
  return result
}

async function getPrintfulOrder(externalId) {
  try {
    const { result } = await printful.get(`orders/@${externalId}`)
    return result
  } catch {
    console.log("Already created")
    return false
  }
}

exports.handler = async (event) => {
  const { payment_intent } = JSON.parse(event.body)

  const stripePaymentIntent = await getStripePaymentIntent(payment_intent)
  const orderData = JSON.parse(stripePaymentIntent.metadata.orderPayload)

  // Check if printful order for this paymentIntent exists
  let printfulOrder = await getPrintfulOrder(payment_intent)
  let emptyCart = false
  if (!printfulOrder) {
    printfulOrder = await createPrintfulOrder(orderData, payment_intent)
    emptyCart = true
  }

  const orderInfo = {
    items: printfulOrder.items.map(({ id, retail_price, name, quantity }) => ({
      id,
      retail_price,
      name,
      quantity,
    })),
    retail_costs: printfulOrder.retail_costs,
    created: printfulOrder.created,
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ orderInfo, emptyCart }),
  }
}
