import { Link } from "gatsby"
import * as React from "react"
import Layout from "../components/layout"

const OrderSuccessPage = () => {
  return (
    <Layout title={"Order Complete"}>
      <div className="text-center">
        <h1 className="text-center">Order successful</h1>
        <p className="text-center">Thank you for shopping!</p>
        <Link className="btn text-white btn-warning" to="/">
          Back to shopping
        </Link>
      </div>
    </Layout>
  )
}

export default OrderSuccessPage
