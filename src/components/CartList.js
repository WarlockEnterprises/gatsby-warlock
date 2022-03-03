import * as React from "react"
import Table from "react-bootstrap/Table"
import Button from "react-bootstrap/Button"
import Form from "react-bootstrap/Form"
import { useCart } from "react-use-cart"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import { Link } from "gatsby"

// Hopefully responsive enough to fit in a cart dropdown
export default function CartList() {
  const { items, removeItem, updateItemQuantity } = useCart()

  return items.length > 0 ? (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <Table className="cart-table" responsive="md">
        <thead>
          <tr>
            <th>Product</th>
            <th>Item</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Total</th>
            <th> </th>
          </tr>
          {items.map(({ id, image, price, quantity, name }) => (
            <tr key={`cart-item-${id}`}>
              <td>
                <GatsbyImage image={getImage(image)} alt={name + " image"} />
              </td>
              <td>{name}</td>
              <td>${(price / 100.0).toFixed(2)}</td>
              <td>
                <Form.Control
                  type="number"
                  aria-label={`${name} quantity`}
                  className="w-auto border-0 text-align-right"
                  style={{ maxWidth: "100px" }}
                  min="1"
                  max="10"
                  value={quantity}
                  onChange={(e) => updateItemQuantity(id, e.target.value)}
                />
              </td>
              <td>${((quantity * price) / 100.0).toFixed(2)}</td>
              <td>
                <Button
                  variant="outline-warning"
                  onClick={() => removeItem(id)}
                >
                  Remove
                </Button>
              </td>
            </tr>
          ))}
        </thead>
      </Table>
      <div className="d-flex justify-content-between flex-row w-100">
        <Link className="btn btn-light" to="/">
          Continue shopping
        </Link>
        <Button variant="warning" className="text-white">
          Checkout
        </Button>
      </div>
    </div>
  ) : (
    <div className="w-100 d-flex flex-column justify-content-center align-items-center mt-5">
      <h4>Nothing here yet</h4>
      <Link className="btn btn-light" to="/">
        Continue shopping
      </Link>
    </div>
  )
}
