const { PrintfulClient } = require("printful-request")
require("dotenv").config(".env")
const printful = new PrintfulClient(process.env.PRINTFUL_API_KEY)

// Get products for this store
async function getProductIds() {
  const limit = 50
  let complete = false
  let offset = 0
  const ids = []
  while (!complete) {
    const {
      result: products,
      paging,
      ...response
    } = await printful.get("sync/products", { limit, offset })
    console.log(response)
    products.forEach((p) => ids.push(p.id))

    if (ids.length >= paging.total) {
      complete = true
      return ids
    } else {
      offset += limit
    }
  }
}

async function getProducts(ids) {
  const products = await Promise.all(
    ids.map(async (id) => {
      const res = await printful.get(`sync/products/${id}`)
      if (res.code === 200) {
        return res.result
      } else {
        throw new Error(res)
      }
    })
  )
  return products
}

async function getPrintfulStoreData() {
  const ids = await getProductIds()
  console.log(ids)
  const products = await getProducts(ids)
  console.log(products[0])
}

getPrintfulStoreData()
