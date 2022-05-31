const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)
const { PrintfulClient } = require("printful-request")

const printful = new PrintfulClient(process.env.PRINTFUL_API_KEY)

async function getTaxRate(recipient) {
  const { result } = await printful.post("/tax/rates", { recipient })
  return result.required ? result.rate : 0
}

/**
 * 1. Normalize cart data into printful order payload
 * 2. Get estimated costs (like a mock order) from printful
 * 3. Create payment intent, store order payload in metadata
 * 4. Return client secret and basic order info to UI.
 */

exports.handler = async (event) => {
  const { items, selectedShipping, recipient } = JSON.parse(event.body)

  // "Normalized" means for printful here
  const normalizedPrintfulItems = items.map((i) => ({
    sync_variant_id: i.variant_id,
    quantity: i.quantity,
    retail_price: i.retail_price,
  }))

  const { firstName, lastName, ...remainingRecipient } = recipient
  const normalizedRecipient = {
    name: `${firstName} ${lastName}`,
    ...remainingRecipient,
  }

  const orderPayload = {
    recipient: normalizedRecipient,
    shipping: selectedShipping.id,
    items: normalizedPrintfulItems,
    retail_costs: {
      currency: "USD",
    },
  }

  const { result } = await printful.post("orders/estimate-costs", orderPayload)

  // Get tax rate for customer's state (from Printful API)
  const taxRate = await getTaxRate(recipient)

  // Subtotal * Sales tax rate
  const taxAmount = parseInt(
    Math.floor(parseFloat(result.retail_costs.subtotal * 100) * taxRate)
  )

  // Shipping + subtotal + tax
  const amount = parseInt(
    parseFloat(result.retail_costs.total) * 100 + taxAmount
  )

  const orderInfo = {
    retail_costs: result.retail_costs,
    taxAmount: taxAmount,
    taxRate: taxRate,
    total: (amount / 100).toFixed(2),
  }

  orderPayload.retail_costs = {
    ...orderPayload.retail_costs,
    tax: (orderInfo.taxAmount / 100).toFixed(2),
    total: orderInfo.total,
  }

  const paymentIntent = await stripe.paymentIntents.create({
    currency: "USD",
    amount,
    automatic_payment_methods: {
      enabled: true,
    },
    metadata: { orderPayload: JSON.stringify(orderPayload) },
    receipt_email: recipient.email,
  })

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      orderInfo,
      clientSecret: paymentIntent.client_secret,
    }),
  }
}
