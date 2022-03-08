const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)
const { PrintfulClient } = require("printful-request")

const printful = new PrintfulClient(process.env.PRINTFUL_API_KEY)

/**
 * 1. Verify items/prices with printful
 * 2. Create sessionw it Stripe
 * 3. Return session id to client
 */
exports.handler = async (event) => {
  const { items } = JSON.parse(event.body)

  const validatedLineItems = await Promise.all(
    items.map(async (listItem) => {
      const { code, result } = await printful.get(`sync/variant/${listItem.id}`)
      if (code == 200) {
        const printfulVariant = result.sync_variant
        const printfulPrice = parseFloat(printfulVariant.retail_price) * 100

        const { name, id, image, quantity } = listItem

        return {
          name,
          images: [image],
          currency: "USD",
          quantity,
          amount: printfulPrice,
        }
      }
    })
  )

  console.log(validatedLineItems, "validated line items")

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    success_url: `${process.env.URL}/order-success`, // success redirect
    cancel_url: `${process.env.URL}/cart`, // cancel redirect
    line_items: validatedLineItems,
  })

  return {
    statusCode: 200,
    body: JSON.stringify({
      sessionId: session.id,
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    }),
  }
}
