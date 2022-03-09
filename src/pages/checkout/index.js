import React, { useState } from "react"
import Layout from "../../components/layout"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Alert from "react-bootstrap/Alert"
import ShippingForm from "../../components/checkout/ShippingForm"
import SubtotalBox from "../../components/checkout/SubtotalBox"
import axios from "axios"

export default function CheckoutPage() {
  const [recipient, setRecipient] = useState(null)
  const [items, setItems] = useState(null)
  const [shippingOptions, setShippingOptions] = useState(null)
  const [shippingError, setShippingError] = useState(null)

  const requestShipping = async ({ formData, items }) => {
    const { data } = await axios.post(
      "/.netlify/functions/calculate-shipment",
      {
        formData,
        items,
      }
    )
    if (data.error) {
      setShippingError(data.error.message)
    } else {
      setShippingOptions(data.result)
      setRecipient(formData)
    }
  }

  return (
    <Layout title={"Checkout"}>
      <Row className="g-4">
        {shippingError && <Alert variant="warning">{shippingError}</Alert>}
        <Col xs={{ span: 12, order: 2 }} lg={8}>
          <ShippingForm
            submitForm={requestShipping}
            shippingOptions={shippingOptions}
            clearShipping={() => setShippingOptions(null)}
          />
        </Col>
        <Col xs={{ span: 12, order: 1 }} lg={{ span: 4, order: 2 }}>
          <SubtotalBox />
        </Col>
      </Row>
    </Layout>
  )
}
