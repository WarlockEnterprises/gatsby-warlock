import * as React from "react"
import Button from "react-bootstrap/Button"
import axios from "axios"
import { loadStripe } from "@stripe/stripe-js"
import { getSrc } from "gatsby-plugin-image"

let stripePromise
const getStripe = (pk) => {
  if (!stripePromise) {
    console.log("key", pk)
    stripePromise = loadStripe(pk)
  }
  return stripePromise
}

// Hopefully responsive enough to fit in a cart dropdown
export default function CartCheckoutButton({ items }) {
  const normalizeItems = () => {
    return items.map(({ external_id, name, quantity, price, image }) => ({
      name,
      quantity,
      image: getSrc(image),
      price,
      external_id,
    }))
  }

  const initCheckout = async () => {
    const response = await axios.post("/.netlify/functions/start-checkout", {
      items: normalizeItems,
    })
    console.log(response.data, "data")
    const stripe = await getStripe(response.data.publishableKey)
    const { error } = await stripe.redirectToCheckout({
      sessionId: response.data.sessionId,
    })

    if (error) {
      console.log(error)
    }
  }

  return (
    <Button
      variant="warning"
      className="text-white"
      type="submit"
      onClick={initCheckout}
    >
      Checkout
    </Button>
  )
}
