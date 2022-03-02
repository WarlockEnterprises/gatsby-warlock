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
      <div className="">
        <Row className="g-0 p-0" data-masonry='{"percentPosition": true}'>
          {products.map((p) => (
            <Col key={p.id} xs="6" md="4" className="p-2 overflow-hidden">
              <Link
                to={p.apparelPath}
                className="text-decoration-none text-black product-image-container"
                style={{ minWidth: "100%" }}
              >
                <div className="product-image">
                  <GatsbyImage
                    image={getImage(p.image)}
                    className="product-image"
                    alt={p.image.title}
                  />
                  <div className="label-container p-2">
                    <span className="font-days-one fs-6 text-center">
                      {p.title}
                    </span>
                  </div>
                </div>
              </Link>
            </Col>
          ))}
        </Row>
      </div>
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
          gatsbyImageData(layout: CONSTRAINED, width: 330)
        }
      }
    }
  }
`

export default IndexPage
