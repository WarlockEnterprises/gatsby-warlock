import React, { useEffect, useState } from "react"
import axios from "axios"
import { loadStripe } from "@stripe/stripe-js"
import { useCart } from "react-use-cart"
import { Elements } from "@stripe/react-stripe-js"
import StripeForm from "./StripeForm"

const PAYMENT_URL = "/.netlify/functions/secure-payment"
const stripePromise = loadStripe(process.env.GATSBY_STRIPE_PUBLISHABLE_KEY)

const StripeContainer = ({ recipient, selectedShipping, setOrderInfo }) => {
  const { items } = useCart()
  const [clientSecret, setClientSecret] = useState("")

  useEffect(() => {
    if (recipient && selectedShipping) {
      axios
        .post(PAYMENT_URL, { items, recipient, selectedShipping })
        .then(({ data }) => {
          setOrderInfo(data.orderInfo)
          setClientSecret(data.clientSecret)
        })
    }
  }, [recipient, selectedShipping])

  const options = {
    clientSecret,
    appearance: { theme: "stripe" },
  }

  return clientSecret && selectedShipping ? (
    <Elements options={options} stripe={stripePromise}>
      <StripeForm />
    </Elements>
  ) : null
}

export default StripeContainer
