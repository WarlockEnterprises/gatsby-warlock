import { navigate } from "gatsby"
import React, { useEffect, useMemo, useState } from "react"
import { Button, Col, Form } from "react-bootstrap"
import { useCart } from "react-use-cart"

export default function ProductForm({ product }) {
  const [variantId, setVariantId] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()

  useEffect(() => {
    if (product.variants) {
      setVariantId(product.variants[0].id)
    }
  }, [product])

  const addToCart = ({ variant, quantity }) => {
    const { external_id, name, retail_price, variant_id } = variant
    const newItem = {
      id: external_id,
      variant_id,
      external_id,
      name,
      price: retail_price * 100,
      image: product.productImage,
    }

    addItem(newItem, quantity)

    navigate("/cart")
  }

  const selectedVariant = useMemo(() => {
    if (product.variants.length > 0 && variantId) {
      return product.variants.find(({ id }) => id === variantId)
    }
  }, [product, variantId])

  return (
    <>
      <Col xs={12}>
        <Form.Group>
          <Form.Label>Color/Size:</Form.Label>
          <Form.Select onChange={(e) => setVariantId(e.target.value)}>
            {product.variants.map((v) => (
              <option key={v.id + "-select"} value={v.id}>
                {v.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      </Col>
      <Col xs={12}>
        <Form.Group>
          <Form.Label>Quantity:</Form.Label>
          <Form.Control
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
          />
        </Form.Group>
      </Col>
      <Col xs={12}>
        <Button
          variant="warning"
          className="w-100 text-white"
          disabled={!variantId}
          onClick={() => addToCart({ variant: selectedVariant, quantity })}
        >
          Add to cart
        </Button>
      </Col>
    </>
  )
}
