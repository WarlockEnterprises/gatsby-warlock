import React, { useEffect, useState } from "react"
import Layout from "../../components/layout"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Alert from "react-bootstrap/Alert"
import AddressForm from "../../components/checkout/AddressForm"
import SubtotalBox from "../../components/checkout/SubtotalBox"
import ShippingOptions from "../../components/checkout/ShippingOptions"
import StripeContainer from "../../components/checkout/StripeContainer"
import { Link } from "gatsby"

const defaultRecipient = {
  email: "",
  firstName: "",
  lastName: "",
  address1: "",
  address2: "",
  city: "",
  state_code: "",
  country_code: "US",
  zip: "",
}

export default function CheckoutPage() {
  const [recipient, setRecipient] = useState(defaultRecipient)
  const [shippingOptions, setShippingOptions] = useState(null)
  const [loading, setLoading] = useState({ shippingOptions: false })
  const [selectedShipping, setSelectedShipping] = useState(null)
  const [shippingError, setShippingError] = useState(null)
  const [orderInfo, setOrderInfo] = useState(null)

  useEffect(() => {
    if (!shippingOptions) {
      console.log("clearing selected shipping")
      setSelectedShipping(null)
      setOrderInfo(null)
    }
  }, [shippingOptions])

  const updateLoading = (uiKey, value) =>
    setLoading({ ...loading, [uiKey]: value })

  return (
    <Layout title={"Checkout"}>
      <h2>Checkout</h2>
      <Row className="g-4" style={{ maxWidth: "1000px" }}>
        <Col xs={{ span: 12, order: 2 }} lg={7}>
          {shippingError && <Alert variant="warning">{shippingError}</Alert>}
          <AddressForm
            setRecipient={setRecipient}
            updateLoading={updateLoading}
            recipient={recipient}
            loading={loading}
            setShippingError={setShippingError}
            setShippingOptions={setShippingOptions}
            setOrderInfo={setOrderInfo}
          />
          <ShippingOptions
            recipient={recipient}
            loading={loading}
            selectedShipping={selectedShipping}
            setSelectedShipping={setSelectedShipping}
            shippingOptions={shippingOptions}
          />
          <StripeContainer
            recipient={recipient}
            setOrderInfo={setOrderInfo}
            selectedShipping={selectedShipping}
          />
        </Col>
        <Col xs={{ span: 12, order: 1 }} lg={{ span: 5, order: 2 }}>
          <SubtotalBox
            selectedShipping={selectedShipping}
            orderInfo={orderInfo}
          />
        </Col>
        <Col xs={{ span: 12, order: 3 }} className="text-center"></Col>
        <Col className="text-center" xs={{ span: 12, order: 4 }}>
          <Link className="btn btn-light" to="/cart">
            Back to cart
          </Link>
        </Col>
      </Row>
    </Layout>
  )
}
