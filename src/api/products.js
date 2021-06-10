import agility from "@agility/content-fetch"

// set up content fetch
const api = agility.getApi({
  guid: process.env.GATSBY_AGILITY_GUID,
  apiKey: process.env.GATSBY_AGILITY_API_KEY,
})

// set up language code
const languageCode = "en-us"

// get schedule products
const getSchedule = async () => {
  // call agility for schedule products
  const response = await api.getContentList({
    referenceName: "schedule",
    languageCode,
  })

  return response
}

// get packages products
const getPackages = async () => {
  // call agility for schedule products
  const response = await api.getContentList({
    referenceName: "packages",
    languageCode,
  })

  return response
}

// get one on one products
const getOneOnOne = async () => {
  // call agility for schedule products
  const response = await api.getContentList({
    referenceName: "oneonone",
    languageCode,
  })

  return response
}

export default async function handler(req, res) {
  // fetch schedule products
  const rawScheduleProducts = await getSchedule()

  // return clean schedule product object
  const scheduleProducts = rawScheduleProducts.items.map(product => {
    return {
      title: product.fields.title,
      id: product.fields.productID,
      image: product.fields.image.url,
      price: product.fields.price,
      description: product.fields.description,
    }
  })

  // fetch packages products
  const rawPackages = await getPackages()

  // return clean packages product object
  const packagesProducts = rawPackages.items.map(product => {
    return {
      title: product.fields.title,
      id: product.fields.productID,
      image: product.fields.image.url,
      price: product.fields.price,
      description: product.fields.description,
    }
  })

  // fetch one on one products
  const rawOneOnOne = await getOneOnOne()

  // return clean one on one product object
  const oneOnOneProducts = rawOneOnOne.items.map(product => {
    return {
      title: product.fields.title,
      id: product.fields.productID,
      image: product.fields.image.url,
      price: product.fields.price,
      description: product.fields.description,
    }
  })

  const products = [
    ...scheduleProducts,
    ...packagesProducts,
    ...oneOnOneProducts,
  ]

  res.status(200).json(products)
}