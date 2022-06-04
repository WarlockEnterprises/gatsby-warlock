import React from "react"
import axios from "axios"
import { loadStripe } from "@stripe/stripe-js"
import { useCart } from "react-use-cart"
import Button from "react-bootstrap/Button"

import PropTypes from "prop-types"

const CREATE_CHECKOUT_PATH = "/.netlify/functions/create-checkout"

const PaymentButton = ({ recipient, shippingOptions }) => {
  const { items } = useCart()
  console.log("farts")

  const stripeCheckout = async () => {
    const stripe = await loadStripe(process.env.GATSBY_STRIPE_PUBLISHABLE_KEY)

    const { data } = await axios.post(CREATE_CHECKOUT_PATH, {
      items,
      recipient,
      shippingOptions,
    })
    console.log("data response", data)
    const { error } = await stripe.redirectToCheckout({
      sessionId: data.sessionId,
    })

    if (error) {
      alert(result.error.message)
    }
  }

  return (
    <Button variant="warning" className="text-white" onClick={stripeCheckout}>
      Confirm and pay
    </Button>
  )
}

PaymentButton.propTypes = {
  recipient: PropTypes.object.isRequired,
  shippingOptions: PropTypes.array.isRequired,
}

export default PaymentButton
