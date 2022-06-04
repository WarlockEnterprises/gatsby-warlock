const PrintfulApi = require("./PrintfulApi")
const { createRemoteFileNode } = require("gatsby-source-filesystem")

const PRINTFUL_PRODUCT_TYPE = "PrintfulProduct"
const PRINTFUL_PRODUCT_VARIANT_TYPE = "PrintfulProductVariant"

exports.pluginOptionsSchema = ({ Joi }) => {
  return Joi.object({
    apiKey: Joi.string()
      .required()
      .description("Your Printful API key")
      .messages({
        "any.required": "You must provide your Printful API key",
      }),
    paginationLimit: Joi.number()
      .integer()
      .max(100)
      .min(10)
      .default(20)
      .description(
        "The number of records to be fetched from Printful in a single API request"
      ),
  })
}

exports.sourceNodes = async (
  {
    actions: { createNode },
    cache,
    createContentDigest,
    createNodeId,
    store,
    reporter,
  },
  { apiKey, paginationLimit }
) => {
  const printful = new PrintfulApi({ apiKey, paginationLimit, reporter })
  const printfulProducts = await printful.getPrintfulStoreData()

  // Create Product Node data
  async function processProductData({
    sync_product: product,
    sync_variants: variants,
  }) {
    let productImageNode
    const productNodeId = createNodeId(`${PRINTFUL_PRODUCT_TYPE}-${product.id}`)

    try {
      const { id } = await createRemoteFileNode({
        url: product.thumbnail_url,
        parentNodeId: productNodeId,
        store,
        cache,
        createNode,
        createNodeId,
      })
      productImageNode = id
    } catch (e) {
      console.error("timmehs-printful-source", e)
    }
    const { variants: variantCount, ...remainingProps } = product
    return {
      ...remainingProps,
      id: productNodeId,
      variant_count: variantCount,
      productImage___NODE: productImageNode,
      variants___NODE: variants.map(({ id }) => id.toString()),
      parent: null,
      chilren: [],
      internal: {
        type: PRINTFUL_PRODUCT_TYPE,
        contentDigest: createContentDigest(product),
      },
    }
  }

  async function processVariantData({ variant, productNodeId }) {
    const variantId = variant.id.toString()

    return {
      ...variant,
      id: variantId,
      variant_id: variant.id,
      parentProduct___NODE: productNodeId,
      internal: {
        type: PRINTFUL_PRODUCT_VARIANT_TYPE,
        contentDigest: createContentDigest(variant),
      },
    }
  }

  let productsCount = 0
  let variantsCount = 0

  await Promise.all(
    printfulProducts.map(async ({ sync_product, sync_variants }) => {
      const productNodeData = await processProductData({
        sync_product,
        sync_variants,
      })
      productsCount += 1

      createNode(productNodeData)

      await Promise.all(
        sync_variants.map(async (variant) => {
          createNode(
            await processVariantData({
              variant,
              productNodeId: productNodeData.id,
            })
          )
          variantsCount += 1
        })
      )
    })
  )
  reporter.success(
    `Printful: ${productsCount} PrintfulProduct nodes, ${variantsCount} PrintfulProductVariant nodes`
  )
}
