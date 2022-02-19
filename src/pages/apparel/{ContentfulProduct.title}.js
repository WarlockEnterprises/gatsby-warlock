import React from "react"
import { graphql } from "gatsby"
import Layout from "../../components/layout"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import { Col, Row } from "react-bootstrap"
// 620ecbcb3b2424
export default function Component({ params, data }) {
  const { title, image, linkedPrintfulProducts } = data.contentfulProduct
  const variants = linkedPrintfulProducts[0].variants

  return (
    <Layout title={title}>
      <Row>
        <Col className="d-flex justify-content-center flex-row">
          <GatsbyImage image={getImage(image)} alt={`Image of ${title}`} />
        </Col>
        <Col>
          <h4 className="font-days-one">"{title}"</h4>
          <select>
            {variants.map(({ catalogVariant }) => {
              const { name, price } = catalogVariant

              return (
                <option key={`variant-${name}`}>
                  {name}, ${price}
                </option>
              )
            })}
          </select>
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
      linkedPrintfulProducts {
        variants {
          catalogVariant {
            name
            price
          }
        }
      }
    }
  }
`
