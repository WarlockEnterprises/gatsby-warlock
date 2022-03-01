import * as React from "react"
import Layout from "../components/layout"
import { graphql, Link } from "gatsby"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import { GatsbyImage, getImage } from "gatsby-plugin-image"

const IndexPage = ({ data }) => {
  const { products } = data.allContentfulProduct

  return (
    <Layout title={"Home"}>
      <Row className="g-5 position-relative">
        {products.map((p) => (
          <Col key={p.id} xs={6} md={5} lg={4} className="text-center mb-5">
            <Link
              to={p.apparelPath}
              className="text-decoration-none text-black"
            >
              <div className="product-image-container">
                <GatsbyImage
                  image={getImage(p.image)}
                  alt={p.image.title}
                  className="product-image"
                />
              </div>
              <div className="mt-3">
                <span className="font-days-one text-center my-2 text-uppercase">
                  "{p.title}"
                </span>
              </div>
            </Link>
          </Col>
        ))}
      </Row>
    </Layout>
  )
}

export const query = graphql`
  {
    allContentfulProduct(sort: { fields: createdAt, order: ASC }) {
      products: nodes {
        title
        id
        apparelPath: gatsbyPath(filePath: "/apparel/{ContentfulProduct.title}")
        image {
          title
          gatsbyImageData(layout: CONSTRAINED)
        }
      }
    }
  }
`

export default IndexPage
