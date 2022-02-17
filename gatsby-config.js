module.exports = {
  siteMetadata: {
    title: `Warlock Enterprises`,
    description: `Official shop for Warlock Enterprises prints, apparel, and NFTs.`,
    author: `tasandberg@gmail.com`,
    siteUrl: `https://warlockenterprises.com`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-sass`,
    `gatsby-plugin-image`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/assets/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
}
