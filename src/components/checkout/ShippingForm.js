import React, { useEffect, useState } from "react"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import axios from "axios"
import { useCart } from "react-use-cart"
const COUNTRIES_URL = "/.netlify/functions/printful-countries"

const ShippingForm = ({ submitForm }) => {
  const { items } = useCart()
  const [validated, setValidated] = useState(false)
  // Country/State Select Options
  const [countries, setCountries] = useState([])
  const [states, setStates] = useState(null)

  // Form Data
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address1: "",
    address2: "",
    city: "",
    state_code: "",
    country_code: "US",
    zip: "",
  })

  useEffect(() => {
    let selectedCountry = countries.find(
      (c) => c.code === formData.country_code
    )
    if (selectedCountry) {
      setStates(selectedCountry.states)
    }
  }, [formData.country_code, countries])

  // Get list of countries for form
  const getCountries = async () => {
    const { data, error } = await axios.get(COUNTRIES_URL)
    if (error) {
      console.error(error)
    } else {
      setCountries(data.countries)
    }
  }

  useEffect(() => {
    if (countries.length === 0) {
      getCountries()
    }
  }, [countries])

  const updateForm = (fieldName) => (e) => {
    console.log(fieldName, e.target.value)
    setFormData({ ...formData, [fieldName]: e.target.value })
  }

  const handleSubmit = (event) => {
    const form = event.currentTarget
    event.preventDefault()
    event.stopPropagation()
    if (form.checkValidity()) {
      submitForm({ formData, items })
    }

    setValidated(true)
  }

  return (
    <Form noValidate validated={validated} onSubmit={handleSubmit}>
      <Row className="g-3">
        <Col xs={6}>
          <Form.Group>
            <Form.Label htmlFor="firstName">First name</Form.Label>
            <Form.Control
              id="firstName"
              required
              value={formData.firstName}
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
              value={formData.lastName}
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
              value={formData.address1}
              onChange={updateForm("address1")}
            />
          </Form.Group>
        </Col>
        <Col xs={12}>
          <Form.Group>
            <Form.Label htmlFor="address2">Address 2 (optional)</Form.Label>
            <Form.Control
              id="address2"
              value={formData.address2}
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
              value={formData.city}
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
            value={formData.country_code}
          >
            {countries.map((c) => (
              <option key={`country-option-${c.name}`} value={c.code}>
                {c.name}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col xs={6}>
          {states && (
            <>
              <Form.Label htmlFor="state">State</Form.Label>
              <Form.Select
                aria-label="State Select"
                id="state"
                required
                onChange={updateForm("state_code")}
                value={formData.state_code}
              >
                <option value="">Choose a state</option>
                {states.map((c) => (
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
              value={formData.zip}
            />
          </Form.Group>
        </Col>
        <Col xs={12}>
          <Button
            type="submit"
            variant="warning"
            className="mt-3 text-white w-100"
          >
            Calculate Shipping
          </Button>
        </Col>
      </Row>
    </Form>
  )
}

export default ShippingForm
