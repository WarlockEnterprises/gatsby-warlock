const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)
const { PrintfulClient } = require("printful-request")

const printful = new PrintfulClient(process.env.PRINTFUL_API_KEY)
// session id example: cs_test_b1eIXsmxQyGdxQ6saXgfoh6zEs0LyQdANyJk8OC9JTpSKV5OqixSjNdLTX

const recipientFromSession = ({ shipping, customer_details }) => {
  const { line1, line2, city, country, postal_code, state } = shipping.address
  return {
    name: shipping.name,
    company: shipping.name,
    address1: line1,
    address2: line2,
    city: city,
    state_code: state,
    country_code: country,
    zip: postal_code,
    email: customer_details.email,
  }
}

/**
 * 1. Accept session id as paramenter
 * 2. Look up line items from session
 * 3. Place order with printful
 * 4. On error: return error message
 * 5. On success: return Order confirmation data
 *   - Thank you, "customer"
 *   - Line items / Prices + quantities
 *   - Email confirmation?
 */

exports.handler = async (event) => {
  const { session_id } = JSON.parse(event.body)
  console.log(session_id, "sesh bro")

  const session = await stripe.checkout.sessions.retrieve(session_id)
  const customer = await stripe.customers.retrieve(session.customer)

  const items = Object.entries(session.metadata).map(([key, value]) => ({
    sync_variant_id: parseInt(key),
    quantity: value,
  }))
  const recipient = recipientFromSession(session)

  console.log("items", items)
  console.log("recipient", recipient)

  // const printfulItems =
  // const recipient = extractRecipientFromSession(session)

  const order = await printful.post("orders?confirm=false", {
    shipping: "STANDARD",
    recipient,
    items,
  })

  console.log(order)

  return {
    statusCode: 200,
    body: JSON.stringify({
      order,
    }),
  }
}
