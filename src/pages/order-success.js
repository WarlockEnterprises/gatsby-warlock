import { Link } from "gatsby"
import React, { useEffect, useState } from "react"
import Layout from "../components/layout"
import queryString from "query-string"
import axios from "axios"
import OrderSummary from "../components/checkout/OrderSummary"
import Spinner from "react-bootstrap/Spinner"

const OrderSuccessPage = ({ location }) => {
  const [finalizingOrder, setFinalizingOrder] = useState(false)
  const [urlIsMalformed, setUrlIsMalformed] = useState(false)
  const [orderInfo, setOrderInfo] = useState(null)
  const [clearCart, setClearCart] = useState(false)

  useEffect(() => {
    if (!finalizingOrder) {
      setFinalizingOrder(true)
      const { session_id } = queryString.parse(location.search)
      if (session_id) {
        axios
          .post("/.netlify/functions/post-payment", { session_id })
          .then((res) => {
            setClearCart(res.data.emptyCart)
            setOrderInfo(res.data.orderInfo)
          })
          .catch((err) => {
            console.error(err)
          })
      } else {
        setUrlIsMalformed(true)
      }
    }
  }, [finalizingOrder, location.search])

  return (
    <Layout title={"Order Complete"}>
      {urlIsMalformed ? (
        <h1>Bad URL</h1>
      ) : (
        <div className="text-center">
          <h1 className="text-center">Order successful</h1>
          <div className="text-center">
            {orderInfo ? (
              <OrderSummary printfulOrder={orderInfo} clearCart={clearCart} />
            ) : (
              <Spinner animation="border" variant="secondary">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            )}
          </div>
          <p className="text-center">
            Thank you for supporting Warlock Enterprises! <br />
            You should receive an email confirmation shortly.
          </p>
          <Link className="btn text-white btn-warning" to="/">
            Back to shopping
          </Link>
        </div>
      )}
    </Layout>
  )
}

export default OrderSuccessPage
