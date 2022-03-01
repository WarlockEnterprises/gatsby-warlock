import React, { useMemo } from "react"
import PropTypes from "prop-types"
import { Link } from "gatsby"
import Navbar from "react-bootstrap/Navbar"
import Container from "react-bootstrap/Container"
import Nav from "react-bootstrap/Nav"
import brandLogo from "../assets/images/brand-logo.svg"
import { Badge } from "react-bootstrap"
import { useCart } from "react-use-cart"

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
  const { items } = useCart()

  const itemCount = useMemo(() => {
    return items.length
  }, [items])

  return (
    <Navbar bg="white" expand="md">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <img
            loading="eager"
            src={brandLogo}
            height="60px"
            alt="Warlock Logo"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {links.map(({ label, color, path }) => (
              <Nav.Link
                as={Link}
                activeStyle={{ textDecoration: "underline" }}
                key={`header-link-${label}`}
                to={path}
                className={`me-3 ${color} d-flex justify-content-end justify-content-md-center align-items-center`}
              >
                {label}
              </Nav.Link>
            ))}
            <Link
              to="/cart"
              className="nav-link cart-link text-black d-flex justify-content-end justify-content-md-center align-items-center me-3 me-md-0 position-relative"
            >
              <div className="position-relative">
                <i className="bi bi-cart3"></i>
                <Badge
                  pill
                  className="position-absolute"
                  style={{ top: "-3px", right: "-8px", fontSize: "10px" }}
                >
                  {itemCount}
                </Badge>
              </div>
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
