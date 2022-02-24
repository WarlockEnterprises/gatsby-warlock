import React, { useEffect, useMemo, useState } from "react"
import { graphql } from "gatsby"
import Layout from "../../components/layout"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import { Button, Col, Form, Row } from "react-bootstrap"
// 620ecbcb3b2424

export default function Component({ params, data }) {
  const { title, image, products } = data.contentfulProduct
  const [variantId, setVariantId] = useState(null)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    if (printfulVariants && variantId === null) {
      setVariantId(printfulVariants[0].id)
    }
  }, [printfulVariants])

  const printfulVariants = useMemo(
    () => products.reduce((arr, p) => arr.concat(p.variants), []),
    [products]
  )
  const selectedVariant = useMemo(
    () =>
      printfulVariants &&
      variantId &&
      printfulVariants.find((v) => v.id === variantId),
    [variantId, printfulVariants]
  )
  return (
    <Layout title={title}>
      <Row className="g-3">
        <Col xs={12} className="d-md-none">
          <h4 className="font-days-one text-center">"{title}"</h4>
        </Col>
        <Col xs={12} md={6} className="d-flex justify-content-center flex-row">
          <GatsbyImage image={getImage(image)} alt={`Image of ${title}`} />
        </Col>

        {/* RIGHT COLUMN */}
        <Col xs={12} md={6}>
          <Row className="g-3">
            <Col xs={12} className="d-none d-md-block">
              <h4 className="font-days-one">"{title}"</h4>
            </Col>
            <Col xs={12}>
              <Form.Group>
                <Form.Label>Product select:</Form.Label>
                <Form.Select onChange={(e) => setVariantId(e.target.value)}>
                  {printfulVariants.map((v) => (
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
                  onChange={(e) => setVariantId(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col xs={6}>
              <Button variant="warning" className="w-100 text-white">
                Add to cart
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </Layout>
  )
}
// This is the page query that connects the data to the actual component. Here you can query for any and all fields
// you need access to within your code. Again, since Gatsby always queries for `id` in the collection, you can use that
// to connect to this GraphQL query.

export const query = graphql`
  query ($id: String) {
    contentfulProduct(id: { eq: $id }) {
      title
      image {
        gatsbyImageData(layout: CONSTRAINED, width: 400)
      }
      products: linkedPrintfulProducts {
        id
        name
        variants {
          variant_id
          external_id
          retail_price
          name
          id
          variantImage {
            childImageSharp {
              gatsbyImageData(width: 70, height: 70)
            }
          }
        }
      }
    }
  }
`
