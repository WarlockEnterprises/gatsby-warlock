import React, { useEffect } from "react"
import { Card, Col, Row } from "react-bootstrap"
import moment from "moment"
import { useCart } from "react-use-cart"

export default function OrderSummary({ printfulOrder, clearCart }) {
  const { items, retail_costs, created } = printfulOrder
  const { emptyCart } = useCart()

  useEffect(() => {
    if (clearCart) {
      emptyCart()
    }
  })

  return (
    <Card className="m-auto mb-3" style={{ maxWidth: "500px" }}>
      <Card.Header className="text-start">
        Order{" "}
        <span className="text-muted small float-end">
          (created {moment(created).format("MMMM Do, YYYY")})
        </span>
      </Card.Header>
      <Card.Body>
        <Row className="small fw-bold">
          <Col xs={6} className="text-start">
            Item
          </Col>
          <Col xs={3} className="text-end">
            Quantity
          </Col>
          <Col className="d-flex justify-content-end" xs={3}>
            Price
          </Col>
        </Row>
        {items.map((i) => (
          <Row className="small mb-3" key={`${i.id}-subtotal-item`}>
            <Col xs={6} className="text-start">
              {i.name} ${i.retail_price}
            </Col>
            <Col className="d-flex justify-content-end" xs={3}>
              {i.quantity}
            </Col>
            <Col className="d-flex justify-content-end" xs={3}>
              ${(i.retail_price * i.quantity).toFixed(2)}
            </Col>
          </Row>
        ))}
        <hr />
        <Row className="small">
          <Col xs={9} className="text-start">
            Subtotal:
          </Col>
          <Col className="text-end">${retail_costs.subtotal}</Col>
          <Col xs={9} className="text-start">
            Shipping
          </Col>
          <Col className="text-end">{`$${retail_costs.shipping}`}</Col>
          {retail_costs.tax && (
            <>
              <Col xs={9} className="text-start">
                Tax
              </Col>
              <Col className="d-flex justify-content-end">
                ${retail_costs.tax}
              </Col>
            </>
          )}
          <Col xs={9} className="fw-bold text-start">
            Total:
          </Col>
          <Col className="d-flex justify-content-end">
            ${retail_costs.total}
          </Col>
        </Row>
      </Card.Body>
    </Card>
  )
}
