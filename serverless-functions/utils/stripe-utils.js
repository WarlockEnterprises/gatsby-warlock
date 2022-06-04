export function buildCustomerProps({
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
  const address = {
    city,
    line1: address1,
    line2: address2,
    postal_code: zip,
    state: state_code,
    country: country_code,
  }
  return {
    description: fullName,
    name: fullName,
    email,
    address,
    shipping: {
      name: fullName,
      address,
    },
  }
}

// https://stripe.com/docs/api/checkout/sessions/create?lang=node
// https://stripe.com/docs/payments/accept-a-payment?integration=checkout
export async function createLineItem({ item }) {
  return {
    quantity: item.quantity,
    price_data: {
      currency: "USD",
      unit_amount_decimal: parseFloat(item.retail_cost),
      product_data: {
        name: item.name,
      },
    },
  }
}

export function buildSessionProps({ recipient, items }) {}

export default {
  createPrice,
  buildSessionProps,
  buildCustomerProps,
}
