import React, { useEffect, useState } from "react"
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { Button, Spinner } from "react-bootstrap"
export default function StripeForm() {
  const stripe = useStripe()
  const elements = useElements()

  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!stripe) {
      return
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    )

    if (!clientSecret) {
      return
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      console.log("retrieved payment intent")
      switch (paymentIntent.status) {
        case "succeeded":
          setMessage("Payment succeeded!")
          break
        case "processing":
          setMessage("Your payment is processing.")
          break
        case "requires_payment_method":
          setMessage("Your payment was not successful, please try again.")
          break
        default:
          setMessage("Something went wrong.")
          break
      }
    })
  }, [stripe])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsLoading(true)

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `https://${window.location.hostname}/order-success`,
      },
    })

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message)
    } else {
      setMessage("An unexpected error occured.")
    }

    setIsLoading(false)
  }

  return (
    <form id="payment-form" className="col-12" onSubmit={handleSubmit}>
      <PaymentElement id="payment-element" />
      <Button
        variant="warning"
        className="text-white my-3 w-100"
        disabled={isLoading || !stripe || !elements}
        type="submit"
        id="submit"
      >
        <span id="Button-text">
          {isLoading ? <Spinner size="sm" animation="border" /> : "Pay now"}
        </span>
      </Button>
      {/* Show any errorBr success messages */}
      <p>{message && <span id="payment-message">{message}</span>}</p>
    </form>
  )
}
