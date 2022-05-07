import React, { useEffect, useState } from "react"
import axios from "axios"
import { loadStripe } from "@stripe/stripe-js"
import { useCart } from "react-use-cart"
import { Elements } from "@stripe/react-stripe-js"
import StripeForm from "./StripeForm"
import Spinner from "react-bootstrap/Spinner"

const PAYMENT_URL = "/.netlify/functions/secure-payment"
const stripePromise = loadStripe(process.env.GATSBY_STRIPE_PUBLISHABLE_KEY)

const StripeContainer = ({ recipient, selectedShipping, setOrderInfo }) => {
  const { items } = useCart()
  const [clientSecret, setClientSecret] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (recipient && selectedShipping) {
      setLoading(true)
      axios
        .post(PAYMENT_URL, { items, recipient, selectedShipping })
        .then(({ data }) => {
          setOrderInfo(data.orderInfo)
          setClientSecret(data.clientSecret)
          setLoading(false)
        })
    }
  }, [recipient, selectedShipping, items, setOrderInfo])

  const options = {
    clientSecret,
    appearance: { theme: "stripe" },
  }

  if (loading) {
    return (
      <div className="text-center">
        <Spinner animation="border" variant="secondary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    )
  } else {
    return clientSecret && selectedShipping ? (
      <Elements options={options} stripe={stripePromise}>
        <StripeForm />
      </Elements>
    ) : null
  }
}

export default StripeContainer
