import React from "react"
import axios from "axios"
import { loadStripe } from "@stripe/stripe-js"
import { useCart } from "react-use-cart"
import Button from "react-bootstrap/Button"

import PropTypes from "prop-types"

const CREATE_CHECKOUT_PATH = "/.netlify/functions/create-checkout"

const PaymentButton = ({ recipient, selectedShipping }) => {
  const { items } = useCart()

  const stripeCheckout = async () => {
    const stripe = await loadStripe(process.env.GATSBY_STRIPE_PUBLISHABLE_KEY)

    const { data } = await axios.post(CREATE_CHECKOUT_PATH, {
      items,
      recipient,
      selectedShipping,
    })
    const { error } = await stripe.redirectToCheckout({
      sessionId: data.sessionId,
    })

    if (error) {
      alert(error.message)
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
  selectedShipping: PropTypes.object.isRequired,
  shippingOptions: PropTypes.array.isRequired,
}

export default PaymentButton
