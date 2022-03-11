import * as React from "react"
import Button from "react-bootstrap/Button"
import axios from "axios"
import { loadStripe } from "@stripe/stripe-js"
import { getSrc } from "gatsby-plugin-image"
import { useCart } from "react-use-cart"

const CHECKOUT_URL = "/.netlify/functions/start-checkout"
let stripePromise
const getStripe = (pk) => {
  if (!stripePromise) {
    stripePromise = loadStripe(pk)
  }
  return stripePromise
}

// Hopefully responsive enough to fit in a cart dropdown
export default function CartCheckoutButton({ selectedShipping, recipient }) {
  const { items } = useCart()

  const normalizeItems = () => {
    return items.map(
      ({
        external_id,
        variant_id,
        name,
        quantity,
        price,
        retail_price,
        image,
      }) => ({
        name,
        quantity,
        image: getSrc(image),
        price,
        id: variant_id,
        retail_price,
        external_id: external_id,
        variant_id: variant_id,
      })
    )
  }

  const initCheckout = async () => {
    const response = await axios.post(CHECKOUT_URL, {
      items: normalizeItems(),
      selectedShipping,
      recipient,
    })

    // const stripe = await getStripe(response.data.publishableKey)

    // const { error } = await stripe.redirectToCheckout({
    //   sessionId: response.data.sessionId,
    // })

    // if (error) {
    //   console.log(error)
    // }
  }

  return selectedShipping ? (
    <Button
      variant="warning"
      className="text-white"
      type="submit"
      onClick={initCheckout}
    >
      Confirm and pay
    </Button>
  ) : null
}
