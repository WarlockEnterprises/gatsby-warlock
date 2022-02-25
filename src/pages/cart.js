import * as React from "react"
import CartList from "../components/CartList"
import Layout from "../components/layout"

const CartPage = () => {
  return (
    <Layout title={"Cart"}>
      <h1>Cart</h1>
      <CartList />
    </Layout>
  )
}

export default CartPage
