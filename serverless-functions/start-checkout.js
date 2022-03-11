const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)
const { PrintfulClient } = require("printful-request")

const printful = new PrintfulClient(process.env.PRINTFUL_API_KEY)

/**
 * 1. Verify items/prices with printful
 * 2. Create session it Stripe
 * 3. Return session id to client
 */
exports.handler = async (event) => {
  const { items, selectedShipping, recipient } = JSON.parse(event.body)

  const normalizedPrintfulItems = items.map((i) => ({
    sync_variant_id: i.variant_id,
    quantity: i.quantity,
  }))

  const { firstName, lastName, ...remainingRecipient } = recipient
  const normalizedRecipient = {
    name: `${firstName} ${lastName}`,
    ...remainingRecipient,
  }

  console.log("items", normalizedPrintfulItems)
  console.log("recipient", normalizedRecipient)

  const order = await printful.post("orders", {
    recipient: normalizedRecipient,
    shipping: selectedShipping.id,
    items: normalizedPrintfulItems,
    retail_costs: {
      currency: "USD",
    },
  })
  console.log(order)

  // Normalized line items for stripe
  // const validatedLineItems = await Promise.all(
  //   items.map(async (listItem) => {
  //     const { code, result } = await printful.get(`sync/variant/${listItem.id}`)
  //     if (code == 200) {
  //       const printfulVariant = result.sync_variant
  //       const printfulPrice = parseFloat(printfulVariant.retail_price) * 100

  //       const { name, image, quantity, variantId } = listItem

  //       return {
  //         name,
  //         images: [image],
  //         currency: "USD",
  //         quantity,
  //         amount: printfulPrice,
  //       }
  //     }
  //   })
  // )

  // const session = await stripe.checkout.sessions.create({
  //   mode: "payment",
  //   automatic_tax: {
  //     enabled: true,
  //   },
  //   success_url: `${process.env.URL}/order-success?session_id={CHECKOUT_SESSION_ID}`, // success redirect
  //   cancel_url: `${process.env.URL}/cart`, // cancel redirect
  //   line_items: validatedLineItems,
  //   metadata: Object.fromEntries(
  //     items.map(({ id, quantity }) => [id, quantity])
  //   ),
  // })

  return {
    statusCode: 200,
    body: JSON.stringify({
      // sessionId: session.id,
      // publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    }),
  }
}
