// Create the link between Contentful products and Printful products
// TODO UNCOMMENT AFTER PLUGIN WORK
// exports.createResolvers = ({ createResolvers }) => {
//   const resolvers = {
//     ContentfulProduct: {
//       linkedPrintfulProducts: {
//         type: ["PrintfulProduct"],
//         resolve: async (source, args, context, info) => {
//           if (!source.printfulProducts) return
//           console.log("Checking for", source.printfulProducts)
//           const { entries } = await context.nodeModel.findAll({
//             query: {
//               filter: {
//                 external_id: {
//                   in: source.printfulProducts.map((str) =>
//                     str.replace("#", "")
//                   ),
//                 },
//               },
//             },
//             type: "PrintfulProduct",
//           })
//           return entries
//         },
//       },
//     },
//   }

//   createResolvers(resolvers)
// }
