const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)
const { PrintfulClient } = require("printful-request")

const printful = new PrintfulClient(process.env.PRINTFUL_API_KEY)

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

  const orderInfo = {
    tax: result.costs.tax,
    retail_costs: result.retail_costs,
  }

  const amount =
    (parseFloat(orderInfo.retail_costs.total) + parseFloat(orderInfo.tax)) * 100

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
