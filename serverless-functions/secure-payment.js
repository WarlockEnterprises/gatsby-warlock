const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)
const { PrintfulClient } = require("printful-request")

const printful = new PrintfulClient(process.env.PRINTFUL_API_KEY)

async function getTaxRate(recipient) {
  const { result } = await printful.post("/tax/rates", { recipient })
  return result.required ? result.rate : 0
}

exports.handler = async (event) => {
  const { items, selectedShipping, recipient } = JSON.parse(event.body)

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

  console.log("items", normalizedPrintfulItems)
  console.log("recipient", normalizedRecipient)

  const { result } = await printful.post("orders", {
    recipient: normalizedRecipient,
    shipping: selectedShipping.id,
    items: normalizedPrintfulItems,
    retail_costs: {
      currency: "USD",
    },
  })

  // Get tax rate for customer's state (from Printful API)
  const taxRate = await getTaxRate(recipient)

  // Subtotal * Sales tax rate
  const taxAmount = parseInt(
    Math.ceil(parseFloat(result.retail_costs.subtotal * 100) * taxRate)
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

  const paymentIntent = await stripe.paymentIntents.create({
    currency: "USD",
    amount,
    automatic_payment_methods: {
      enabled: true,
    },
    metadata: {
      orderId: result.id,
    },
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
