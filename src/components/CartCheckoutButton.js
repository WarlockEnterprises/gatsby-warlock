import * as React from "react"
import Table from "react-bootstrap/Table"
import Button from "react-bootstrap/Button"
import Form from "react-bootstrap/Form"
import { useCart } from "react-use-cart"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import { Link } from "gatsby"

// Hopefully responsive enough to fit in a cart dropdown
export default function CartCheckoutButton({ items }) {
  const initCheckout = async () => {}

  return (
    <Button
      variant="warning"
      className="text-white"
      type="submit"
      onClick={initCheckout}
    >
      Checkout
    </Button>
  )
}
