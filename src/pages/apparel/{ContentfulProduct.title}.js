import React, { useState } from "react"
import { graphql } from "gatsby"
import Layout from "../../components/layout"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import { Col, Row } from "react-bootstrap"
import ProductForm from "../../components/product/ProductForm"
import ProductSelect from "../../components/product/ProductSelect"

export default function ProductPage({ data }) {
  const { title, image, products } = data.contentfulProduct
  const [selectedProduct, setSelectedProduct] = useState()

  return (
    <Layout title={title}>
      <Row className="g-3">
        <Col xs={12} className="d-md-none">
          <h4 className="font-days-one text-center">"{title}"</h4>
        </Col>
        <Col xs={12} md={5} className="d-flex justify-content-center flex-row">
          <GatsbyImage image={getImage(image)} alt={`Image of ${title}`} />
        </Col>
        <Col />

        {/* RIGHT COLUMN */}
        <Col xs={12} md={6}>
          <Row className="g-3" style={{ maxWidth: "400px" }}>
            <Col xs={12} className="d-none d-md-block">
              <h4 className="font-days-one">"{title}"</h4>
            </Col>
            <Col xs={12}>
              {products && products.length > 0 ? (
                <ProductSelect
                  products={products}
                  setSelectedProduct={setSelectedProduct}
                  selectedProduct={selectedProduct}
                />
              ) : (
                <p>No products yet, please check back later.</p>
              )}
            </Col>
            {selectedProduct && <ProductForm product={selectedProduct} />}
          </Row>
        </Col>
      </Row>
    </Layout>
  )
}

export const query = graphql`
  query ($id: String) {
    contentfulProduct(id: { eq: $id }) {
      title
      image {
        gatsbyImageData
      }
      products: linkedPrintfulProducts {
        id
        name
        productImage {
          childImageSharp {
            gatsbyImageData(width: 100, height: 100)
          }
        }
        variants {
          variant_id
          external_id
          retail_price
          name
          id
        }
      }
    }
  }
`
