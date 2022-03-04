const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

const normalizeLineItem = ({ id, name, quantity, price, image }) => ({
  name,
  quantity,
})

exports.handler = async (event) => {
  console.log(JSON.parse(event.body))
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    success_url: `${process.env.URL}`, // success redirect
    cancel_url: `${process.env.URL}`, // cancel redirect
    line_items: [
      {
        name: "test product",
        description: "test description",
        amount: 1000,
        currency: "USD",
        quantity: 2,
      },
    ],
  })

  return {
    statusCode: 200,
    body: JSON.stringify({
      sessionId: session.id,
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    }),
  }
}
