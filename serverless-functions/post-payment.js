const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)
const { PrintfulClient } = require("printful-request")

const printful = new PrintfulClient(process.env.PRINTFUL_API_KEY)

/**
 * POST PURCHASE HANDLER
 *
 * This endpoint is called from the order-success page which is redirected to from a
 * successful stripe payment with a checkout session_Id.
 *
 * 1. Look up Stripe checkout session
 * 2. Find or create a Printful order with the external_id: session.client_reference_id (token generated in create-checkout.js)
 *   - Use order data from JSON.parse(session.metadata.printfulOrder) (stored in create-checkout.js)
 * 5. On success: return Order confirmation data
 *   - Thank you, "customer"
 *   - Line items / Prices + quantities
 */
exports.handler = async (event) => {
  let emptyCart = false

  const { session_id } = JSON.parse(event.body)

  const session = await stripe.checkout.sessions.retrieve(session_id)
  if (!session.client_reference_id) {
    return {
      statusCode: 404,
      body: JSON.stringify({ error: { message: "Order not found." } }),
    }
  }
  // Check if printful order for this paymentIntent exists
  let printfulOrder = await getPrintfulOrder(session.client_reference_id)
  if (!printfulOrder) {
    const orderData = JSON.parse(session.metadata.printfulOrder)
    console.log("Creating order with", orderData)
    printfulOrder = await createPrintfulOrder(
      orderData,
      session.client_reference_id
    )
    emptyCart = true
  } else {
    console.log("PRINTFUL ORDER FOUND", session.client_reference_id)
  }

  const orderInfo = buildOrderInfo(printfulOrder)

  return {
    statusCode: 200,
    body: JSON.stringify({ orderInfo, emptyCart }),
  }
}
/** END HANDLER */

/**
 * UTILITIES
 * 1. createPrintfulOrder
 * 2. getPrintfulOrder
 * 3. buildOrderInfo
 */
async function createPrintfulOrder(orderData, clientReferenceId) {
  const { result } = await printful.post(`orders`, {
    ...orderData,
    external_id: clientReferenceId,
  })
  return result
}

async function getPrintfulOrder(externalId) {
  try {
    const { result } = await printful.get(`orders/@${externalId}`)
    return result
  } catch (e) {
    if (e.code === 404 && e.result === "Not Found") {
      console.log(`No order found for id ${externalId}`)
      return false
    }

    throw e
  }
}

function buildOrderInfo(printfulOrder) {
  return {
    items: printfulOrder.items.map(({ id, retail_price, name, quantity }) => ({
      id,
      retail_price,
      name,
      quantity,
    })),
    retail_costs: printfulOrder.retail_costs,
    created: printfulOrder.created,
  }
}
