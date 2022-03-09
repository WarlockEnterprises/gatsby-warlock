import React from "react"
import Layout from "../components/layout"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import ShippingForm from "../components/checkout/ShippingForm"
import SubtotalBox from "../components/checkout/SubtotalBox"
import axios from "axios"

export default function CheckoutPage() {
  const requestShipping = async ({ formData, items }) => {
    const response = await axios.post(
      "/.netlify/functions/calculate-shipment",
      {
        formData,
        items,
      }
    )
    console.log(response)
  }
  return (
    <Layout title={"Checkout"}>
      <Row className="g-4">
        <Col xs={{ span: 12, order: 2 }} md={8}>
          <ShippingForm submitForm={requestShipping} />
        </Col>
        <Col xs={{ span: 12, order: 1 }} md={{ span: 4, order: 2 }}>
          <SubtotalBox />
        </Col>
      </Row>
    </Layout>
  )
}
