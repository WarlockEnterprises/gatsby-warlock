require("dotenv").config({
  path: ".env",
})

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

/** HANDLER */
exports.handler = async (event) => {
  const { recipient, items, selectedShipping } = JSON.parse(event.body)

  // Build and create customer
  const customerProps = buildStripeCustomerProps(recipient)
  const customer = await stripe.customers.create(customerProps)

  // Build and create session
  const sessionProps = buildStripeSessionProps({
    customer_id: customer.id,
    items,
    selectedShipping,
    metadata: { printfulOrder: buildPrintfulOrder({ recipient, items }) },
  })
  const session = await stripe.checkout.sessions.create(sessionProps)

  return {
    statusCode: 200,
    body: JSON.stringify({ sessionId: session.id }),
  }
}

/** Printful Utils */
function buildPrintfulOrder({ recipient, items }) {
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
    items: normalizedPrintfulItems,
    retail_costs: {
      currency: "USD",
    },
  }

  return JSON.stringify(orderPayload)
}

/** STRIPE UTILS */
function buildStripeCustomerProps({
  firstName,
  lastName,
  email,
  address1,
  address2,
  city,
  state_code,
  country_code,
  zip,
}) {
  const fullName = `${firstName} ${lastName}`
  return {
    description: fullName,
    name: fullName,
    email,
    shipping: {
      name: fullName,
      address: {
        city,
        line1: address1,
        line2: address2,
        postal_code: zip,
        state: state_code,
        country: country_code,
      },
    },
  }
}

function buildStripeLineItem(item) {
  return {
    quantity: item.quantity,
    price_data: {
      currency: "usd",
      unit_amount: item.price,
      product_data: {
        name: item.name,
      },
    },
  }
}

function buildShippingOption({
  name,
  id,
  currency,
  rate,
  minDeliveryDays,
  maxDeliveryDays,
}) {
  return {
    shipping_rate_data: {
      display_name: name,
      type: "fixed_amount",
      delivery_estimate: {
        maximum: { unit: "day", value: maxDeliveryDays },
        minimum: { unit: "day", value: minDeliveryDays },
      },
      fixed_amount: {
        amount: parseFloat(rate) * 100,
        currency: currency,
      },
      metadata: { id },
    },
  }
}

function buildStripeSessionProps({
  customer_id,
  items,
  selectedShipping,
  metadata,
}) {
  return {
    customer: customer_id,
    client_reference_id: randomToken(),
    line_items: items.map(buildStripeLineItem),
    mode: "payment",
    success_url: `${process.env.BASE_URL}/order-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.BASE_URL}/cart`,
    shipping_options: [buildShippingOption(selectedShipping)],
    metadata,
  }
}

function randomToken() {
  return Array.from(Array(16), () =>
    Math.floor(Math.random() * 36).toString(36)
  ).join("")
}
