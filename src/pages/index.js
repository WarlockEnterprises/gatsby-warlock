import * as React from "react"
import Layout from "../components/layout"
import { graphql } from "gatsby"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import { GatsbyImage, getImage } from "gatsby-plugin-image"

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
            <div className="position-relative overflow-hidden product-image">
              <GatsbyImage image={getImage(p.image)} alt={p.image.title} />
              <div className="product-title-pop-up">
                <h5 className=" font-days-one text-center my-2 text-uppercase">
                  "{p.title}"
                </h5>
              </div>
            </div>
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
