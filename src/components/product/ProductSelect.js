import { GatsbyImage, getImage } from "gatsby-plugin-image"
import React, { useEffect } from "react"
import Button from "react-bootstrap/Button"
import Form from "react-bootstrap/Form"

export default function ProductSelect({
  products,
  setSelectedProduct,
  selectedProduct,
}) {
  useEffect(() => {
    if (products.length > 0 && !selectedProduct) {
      setSelectedProduct(products[0])
    }
  }, [products, selectedProduct, setSelectedProduct])

  return (
    <div className="w-100">
      <div className="pb-3 px-3 d-flex justify-content-center">
        <GatsbyImage
          image={getImage(selectedProduct.highlightImage)}
          alt={selectedProduct.name}
          layout="fullWidth"
          objectFit="contain"
        />
      </div>
      {selectedProduct && <h5>{selectedProduct.name}</h5>}
      <Form.Label>Please select a product:</Form.Label>
      <div className="d-flex flex-row">
        {products.map((p) => {
          const active = selectedProduct && p.id === selectedProduct.id
          return (
            <div
              key={`product-btn-${p.id}`}
              style={{ maxWidth: "50px" }}
              className="me-2 my-2"
            >
              <Button
                className={`p-0 bg-transparent border-2 border-${
                  active ? "primary" : "white"
                }`}
                onClick={() => setSelectedProduct(p)}
                title={p.name}
              >
                <GatsbyImage image={getImage(p.productImage)} alt={p.name} />
              </Button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
