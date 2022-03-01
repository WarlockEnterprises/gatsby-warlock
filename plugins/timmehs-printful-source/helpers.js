const { PrintfulClient } = require("printful-request")

class PrintfulApi {
  constructor({ apiKey, paginationLimit }) {
    this.printful = new PrintfulClient(apiKey)
    this.paginationLimit = paginationLimit
  }

  // Get products for this store
  async getProductIds() {
    const limit = this.paginationLimit

    let complete = false
    let offset = 0
    const ids = []

    while (!complete) {
      const {
        result: products,
        paging,
        ...response
      } = await this.printful.get("sync/products", { limit, offset })

      products.forEach((p) => ids.push(p.id))

      if (ids.length >= paging.total) {
        complete = true
        console.log("IDs acquired.", ids.length, paging)
        return ids
      } else {
        offset += limit
      }
    }
  }

  async getProducts(ids) {
    const products = await Promise.all(
      ids.map(async (id) => {
        const res = await this.printful.get(`sync/products/${id}`)
        if (res.code === 200) {
          return res.result
        } else {
          throw new Error(res)
        }
      })
    )
    return products
  }

  async getPrintfulStoreData() {
    const ids = await this.getProductIds()
    const products = await this.getProducts(ids)
    return products
  }
}

module.exports = PrintfulApi
