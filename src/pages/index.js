import * as React from "react"
import Layout from "../components/layout"
import { graphql } from "gatsby"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import { GatsbyImage, getImage, getImageData } from "gatsby-plugin-image"

const IndexPage = ({ data }) => {
  const { products } = data.allContentfulProduct

  return (
    <Layout title={"Home"}>
      <Row className="g-4">
        {products.map((p) => (
          <Col
            key={p.id}
            xs={12}
            md={6}
            lg={4}
            className="d-flex flex-column justify-content-center align-items-center"
          >
            <GatsbyImage
              className="product-image"
              image={getImage(p.image)}
              alt={p.image.title}
            />
            {/* <span className="fs-5 font-days-one text-center my-5 text-uppercase">
              "{p.title}"
            </span> */}
          </Col>
        ))}
      </Row>
    </Layout>
  )
}

export const query = graphql`
  {
    printfulStore {
      id
    }
    allContentfulProduct(sort: { fields: createdAt, order: ASC }) {
      products: nodes {
        title
        id
        image {
          title
          gatsbyImageData(width: 400, height: 400, cropFocus: CENTER)
        }
      }
    }
  }
`

export default IndexPage
