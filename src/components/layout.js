/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import * as React from "react"
import PropTypes from "prop-types"
import { useStaticQuery, graphql } from "gatsby"

import Header from "./header"
import "../assets/styles/layout.scss"
import { Container } from "react-bootstrap"
import Seo from "./seo"
import { CartProvider } from "react-use-cart"

const Layout = ({ title, children }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  return (
    <div>
      <Seo title={title} />
      <CartProvider>
        <Header siteTitle={data.site.siteMetadata?.title || `Title`} />
        <Container className="pt-3">{children}</Container>
      </CartProvider>
    </div>
  )
}

Layout.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
}

export default Layout
