import * as React from "react"
import PropTypes from "prop-types"
import { Link } from "gatsby"
import Navbar from "react-bootstrap/Navbar"
import Container from "react-bootstrap/Container"
import Nav from "react-bootstrap/Nav"
import { StaticImage } from "gatsby-plugin-image"

const links = [
  {
    label: "Apparel",
    color: "warlock-red",
    path: "/apparel",
  },
  {
    label: "Prints",
    color: "warlock-blue",
    path: "/prints",
  },
  {
    label: "NFTs",
    color: "warlock-orange",
    path: "/nfts",
  },
  {
    label: "Contact",
    color: "warlock-green",
    path: "/contact",
  },
]

const Header = ({ siteTitle }) => (
  <Navbar bg="white" expand="md">
    <Container className="py-3">
      <Navbar.Brand href="#home">
        <StaticImage src="../assets/images/brand-logo.svg" alt="Warlock Logo" />
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ms-auto">
          {links.map(({ label, color, path }) => (
            <Nav.Link
              key={`header-link-${label}`}
              as={Link}
              to={path}
              className={`me-5 ${color}`}
            >
              {label}
            </Nav.Link>
          ))}
          <Nav.Link as={Link} to="/cart" className="cart-link">
            <i className="bi bi-cart3" />
            <span className="ms-2 d-inline d-md-none">Cart</span>
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar>
)

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
