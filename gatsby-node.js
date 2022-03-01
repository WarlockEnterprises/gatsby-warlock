// Create the link between Contentful products and Printful products
// TODO UNCOMMENT AFTER PLUGIN WORK
exports.createResolvers = ({ createResolvers }) => {
  const resolvers = {
    ContentfulProduct: {
      linkedPrintfulProducts: {
        type: ["PrintfulProduct"],
        resolve: async (source, args, context, info) => {
          console.log("using regex ", `/(${source.title})/i`)

          const { entries } = await context.nodeModel.findAll({
            query: {
              filter: {
                name: {
                  regex: `/${source.title}/i`,
                },
              },
            },
            type: "PrintfulProduct",
          })
          return entries
        },
      },
    },
  }

  createResolvers(resolvers)
}
