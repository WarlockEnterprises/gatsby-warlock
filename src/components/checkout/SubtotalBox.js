import * as React from "react"
import { useCart } from "react-use-cart"
import Card from "react-bootstrap/Card"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"

const SubtotalBox = ({ shippingCost }) => {
  const { items, cartTotal } = useCart()
  console.log(items)

  return (
    <Card>
      <Card.Header>Order</Card.Header>
      <Card.Body>
        <Row className="small fw-bold">
          <Col xs={6}>Item</Col>
          <Col className="d-flex justify-content-end" xs={3}>
            Quantity
          </Col>
          <Col className="d-flex justify-content-end" xs={3}>
            Price
          </Col>
        </Row>
        {items.map((i) => (
          <Row className="small mb-3" key={`${i.id}-subtotal-item`}>
            <Col xs={6}>
              {i.name} ${(i.price / 100).toFixed(2)}
            </Col>
            <Col className="d-flex justify-content-end" xs={3}>
              {i.quantity}
            </Col>
            <Col className="d-flex justify-content-end" xs={3}>
              ${((i.price * i.quantity) / 100).toFixed(2)}
            </Col>
          </Row>
        ))}
        <Row>
          <Col className="fw-bold">Subtotal:</Col>
          <Col className="d-flex justify-content-end">
            ${(cartTotal / 100).toFixed(2)}
          </Col>
        </Row>
      </Card.Body>
    </Card>
  )
}

export default SubtotalBox