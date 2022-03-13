import React, { useEffect, useState, useMemo } from "react"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import axios from "axios"
import { useCart } from "react-use-cart"
import { Card, Spinner } from "react-bootstrap"
import RecipientInfo from "./RecipientInfo"

const COUNTRIES_URL = "/.netlify/functions/printful-countries"
const SHIPPING_RATES_URL = "/.netlify/functions/calculate-shipment"

const AddressForm = ({
  setRecipient,
  recipient,
  setShippingOptions,
  setShippingError,
  loading,
  updateLoading,
  setOrderInfo,
}) => {
  const [editing, setEditing] = useState(true)
  const [validated, setValidated] = useState(false)
  const [countries, setCountries] = useState([])
  const { items } = useCart()

  // Set state options for selected country
  const stateOptions = useMemo(() => {
    let selectedCountry = countries.find(
      (c) => c.code === recipient.country_code
    )
    return selectedCountry ? selectedCountry.states : null
  }, [recipient.country_code, countries])

  // Populate countries
  useEffect(() => {
    if (countries.length === 0) {
      getCountries()
    }
  }, [countries])

  // Get list of countries for form
  const getCountries = async () => {
    const { data, error } = await axios.get(COUNTRIES_URL)
    if (error) {
      console.error(error)
    } else {
      setCountries(data.countries)
    }
  }

  // Generic onChange function for address form fields
  const updateForm = (fieldName) => (e) =>
    setRecipient({ ...recipient, [fieldName]: e.target.value })

  const requestShipping = async ({ formData, items }) => {
    updateLoading("shippingOptions", true)
    const { data } = await axios.post(SHIPPING_RATES_URL, {
      formData,
      items,
    })
    if (data.error) {
      setShippingError(data.error.message)
    } else {
      setShippingOptions(data.result)
    }
    setEditing(false)
    updateLoading("shippingOptions", false)
  }

  const handleSubmit = (event) => {
    const form = event.currentTarget
    event.preventDefault()
    event.stopPropagation()

    if (form.checkValidity()) {
      requestShipping({ formData: recipient, items })
    }

    setValidated(true)
  }

  return (
    <Card className="mb-4">
      <Card.Header className="d-flex justify-content-between align-items-center">
        Shipping Info
        {!editing && (
          <Button
            variant="link"
            onClick={() => {
              setEditing(true)
              setShippingOptions(null)
              setOrderInfo(null)
            }}
          >
            Edit
          </Button>
        )}
      </Card.Header>
      <Card.Body>
        {!editing ? (
          <RecipientInfo {...recipient} />
        ) : (
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Row className="g-3">
              <Col xs={12}>
                <Form.Group>
                  <Form.Label htmlFor="firstName">Email</Form.Label>
                  <Form.Control
                    id="email"
                    required
                    value={recipient.email}
                    onChange={updateForm("email")}
                  />
                </Form.Group>
              </Col>
              <Col xs={6}>
                <Form.Group>
                  <Form.Label htmlFor="firstName">First name</Form.Label>
                  <Form.Control
                    id="firstName"
                    required
                    value={recipient.firstName}
                    onChange={updateForm("firstName")}
                  />
                </Form.Group>
              </Col>
              <Col xs={6}>
                <Form.Group>
                  <Form.Label htmlFor="lastName">Last Name</Form.Label>
                  <Form.Control
                    id="lastName"
                    required
                    value={recipient.lastName}
                    onChange={updateForm("lastName")}
                  />
                </Form.Group>
              </Col>
              <Col xs={12}>
                <Form.Group>
                  <Form.Label htmlFor="address1">Address 1</Form.Label>
                  <Form.Control
                    id="address1"
                    required
                    value={recipient.address1}
                    onChange={updateForm("address1")}
                  />
                </Form.Group>
              </Col>
              <Col xs={12}>
                <Form.Group>
                  <Form.Label htmlFor="address2">
                    Address 2 (optional)
                  </Form.Label>
                  <Form.Control
                    id="address2"
                    value={recipient.address2}
                    onChange={updateForm("address2")}
                  />
                </Form.Group>
              </Col>
              <Col xs={6}>
                <Form.Group>
                  <Form.Label htmlFor="city">City</Form.Label>
                  <Form.Control
                    id="city"
                    required
                    value={recipient.city}
                    onChange={updateForm("city")}
                  />
                </Form.Group>
              </Col>
              <Col xs={6} />
              <Col xs={6}>
                <Form.Label htmlFor="country">Country</Form.Label>
                <Form.Select
                  aria-label="Country Select"
                  id="country"
                  required
                  onChange={updateForm("country_code")}
                  value={recipient.country_code}
                >
                  {countries.map((c) => (
                    <option key={`country-option-${c.name}`} value={c.code}>
                      {c.name}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col xs={6}>
                {stateOptions && (
                  <>
                    <Form.Label htmlFor="state">State</Form.Label>
                    <Form.Select
                      aria-label="State Select"
                      id="state"
                      required
                      onChange={updateForm("state_code")}
                      value={recipient.state_code}
                    >
                      <option value="">Choose a state</option>
                      {stateOptions.map((c) => (
                        <option key={`state-option-${c.name}`} value={c.code}>
                          {c.name}
                        </option>
                      ))}
                    </Form.Select>
                  </>
                )}
              </Col>
              <Col xs={6}>
                <Form.Group>
                  <Form.Label htmlFor="postalCode">Postal Code</Form.Label>
                  <Form.Control
                    id="postalCode"
                    required
                    onChange={updateForm("zip")}
                    value={recipient.zip}
                  />
                </Form.Group>
              </Col>
              <Col xs={12}>
                <Button
                  type="submit"
                  variant="warning"
                  className="mt-3 text-white w-100"
                >
                  {loading.shippingOptions ? (
                    <Spinner size="sm" animation="border" />
                  ) : (
                    "Save"
                  )}
                </Button>
              </Col>
            </Row>
          </Form>
        )}
      </Card.Body>
    </Card>
  )
}

export default AddressForm
