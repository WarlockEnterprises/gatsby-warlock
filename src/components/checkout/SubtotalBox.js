import React, { useMemo } from "react"
import { useCart } from "react-use-cart"
import Card from "react-bootstrap/Card"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"

const SubtotalBox = ({ selectedShipping, taxRate }) => {
  const { items, cartTotal } = useCart()

  const subtotal = useMemo(() => {
    console.log("subtotal", cartTotal)
    let sum = cartTotal

    if (selectedShipping) {
      sum += selectedShipping.rate * 100
    }

    if (taxRate) {
      console.log("tax", taxRate)
      console.log("sum", sum)
      sum += taxRate * cartTotal
    }
    return (sum / 100).toFixed(2)
  }, [cartTotal, selectedShipping, taxRate])

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
        <hr />
        <Row className="small mb-3">
          <Col>Subtotal:</Col>
          <Col className="d-flex justify-content-end">
            ${(cartTotal / 100).toFixed(2)}
          </Col>
        </Row>
        {selectedShipping && (
          <Row className="small mb-3">
            <Col xs={9}>Shipping</Col>
            <Col className="d-flex justify-content-end">
              ${selectedShipping.rate}
            </Col>
          </Row>
        )}
        {taxRate && (
          <Row className="small mb-3">
            <Col xs={9}>Sales Tax</Col>
            <Col className="d-flex justify-content-end">
              ${((taxRate * cartTotal) / 100).toFixed(2)}
            </Col>
          </Row>
        )}
        <Row className="small">
          <Col className="fw-bold">Total:</Col>
          <Col className="d-flex justify-content-end">${subtotal}</Col>
        </Row>
      </Card.Body>
    </Card>
  )
}

export default SubtotalBox
