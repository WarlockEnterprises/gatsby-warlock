require("dotenv").config({
  path: ".env",
})

module.exports = {
  siteMetadata: {
    title: `Warlock Enterprises`,
    description: `Official shop for Warlock Enterprises prints, apparel, and NFTs.`,
    author: `tasandberg@gmail.com`,
    siteUrl: `https://warlockenterprises.com`,
  },
  plugins: [
    {
      resolve: `timmehs-printful-source`,
      options: {
        apiKey: process.env.PRINTFUL_API_KEY,
        paginationLimit: 50,
      },
    },
    {
      resolve: `gatsby-source-contentful`,
      options: {
        spaceId: process.env.CONTENTFUL_SPACE_ID,
        accessToken: process.env.CONTENTFUL_API_KEY,
      },
    },
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
  ],
}
