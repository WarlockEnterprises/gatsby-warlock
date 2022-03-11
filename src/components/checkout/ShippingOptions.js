import React, { useState } from "react"
import Button from "react-bootstrap/Button"
import { Card, Form } from "react-bootstrap"

const ShippingOptions = ({
  selectedShipping,
  shippingOptions,
  setSelectedShipping,
}) => {
  const [editing, setEditing] = useState(true)

  return shippingOptions ? (
    <Card className="mb-4">
      <Card.Header className="d-flex justify-content-between align-items-center">
        Shipping method
        {!editing && (
          <Button variant="link" onClick={() => setEditing(true)}>
            Edit
          </Button>
        )}
      </Card.Header>
      <Card.Body>
        {shippingOptions.map((o) => (
          <Form.Check
            type="radio"
            selected={selectedShipping && selectedShipping.id === o.id}
            onChange={() => setSelectedShipping(o)}
            label={`${o.name} $${o.rate}`}
            value={o.id}
            key={`radio-${o.id}`}
          />
        ))}
      </Card.Body>
    </Card>
  ) : null
}

export default ShippingOptions
