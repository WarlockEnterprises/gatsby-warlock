import { Link } from "gatsby"
import React, { useEffect, useState } from "react"
import Layout from "../components/layout"
import queryString from "query-string"
import axios from "axios"

const OrderSuccessPage = ({ location }) => {
  const [finalizingOrder, setFinalizingOrder] = useState(false)
  const [urlIsMalformed, setUrlIsMalformed] = useState(false)

  useEffect(() => {
    if (!finalizingOrder) {
      setFinalizingOrder(true)
      const { payment_intent } = queryString.parse(location.search)
      if (payment_intent) {
        axios
          .post("/.netlify/functions/post-payment", { payment_intent })
          .then((res) => {
            console.log(res)
          })
          .catch((err) => {
            console.error(err)
          })
      } else {
        setUrlIsMalformed(true)
      }
    }
  }, [finalizingOrder, location])

  return (
    <Layout title={"Order Complete"}>
      {urlIsMalformed ? (
        <h1>Bad URL</h1>
      ) : (
        <div className="text-center">
          <h1 className="text-center">Order successful</h1>
          <p className="text-center">
            Thank you for supporting Warlock Enterprises!
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
