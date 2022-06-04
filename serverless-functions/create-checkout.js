require("dotenv").config({
  path: ".env",
})

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

exports.handler = async (event) => {
  const { recipient, items, shippingOptions } = JSON.parse(event.body)

  // Build and create customer
  const customerProps = buildStripeCustomerProps(recipient)
  const customer = await stripe.customers.create(customerProps)

  // Build and create session
  const sessionProps = buildStripeSessionProps({
    customer_id: customer.id,
    items,
    shippingOptions,
  })
  const session = await stripe.checkout.sessions.create(sessionProps)

  return {
    statusCode: 200,
    body: JSON.stringify({ sessionId: session.id }),
  }
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

function buildStripeSessionProps({ customer_id, items, shippingOptions }) {
  return {
    customer: customer_id,
    line_items: items.map(buildStripeLineItem),
    mode: "payment",
    success_url: `${process.env.BASE_URL}/order-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.BASE_URL}/cart`,
    shipping_options: shippingOptions.map(buildShippingOption),
  }
}
