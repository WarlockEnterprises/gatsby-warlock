import React from "react"
import PropTypes from "prop-types"
import { Link } from "gatsby"
import Navbar from "react-bootstrap/Navbar"
import Container from "react-bootstrap/Container"
import Nav from "react-bootstrap/Nav"
import brandLogo from "../assets/images/brand-logo.svg"

const links = [
  {
    label: "Apparel",
    color: "text-danger",
    path: "/",
  },
  {
    label: "Prints",
    color: "text-secondary",
    path: "/prints",
  },
  {
    label: "NFTs",
    color: "text-warning",
    path: "/nfts",
  },
  {
    label: "Contact",
    color: "text-success",
    path: "/contact",
  },
]

const Header = ({ siteTitle }) => {
  return (
    <Navbar bg="white" expand="md">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <img loading="eager" src={brandLogo} alt="Warlock Logo" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto d-flex flex-row align-items-center">
            {links.map(({ label, color, path }) => (
              <Nav.Link
                as={Link}
                activeStyle={{ textDecoration: "underline" }}
                key={`header-link-${label}`}
                to={path}
                className={`me-5 ${color}`}
              >
                {label}
              </Nav.Link>
            ))}
            <Link to="/cart" className="nav-link cart-link text-black">
              <i className="bi bi-cart3" />
              <span className="ms-2 d-inline d-md-none">Cart</span>
            </Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
