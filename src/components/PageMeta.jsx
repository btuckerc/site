import { Helmet } from 'react-helmet-async'

const defaultImage = 'https://btuckerc.dev/og-image.jpg'
const defaultImageAlt = 'Technical project card for s3-amoled, covering Pokémon, an AI handoff, and Grain.'

const PageMeta = ({
  title,
  description,
  url,
  type = 'website',
  image = defaultImage,
  imageAlt = defaultImageAlt,
  openGraphDescription = description
}) => (
  <Helmet>
    <title>{title}</title>
    <meta name="title" content={title} />
    <meta name="description" content={description} />
    <meta property="og:type" content={type} />
    <meta property="og:url" content={url} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={openGraphDescription} />
    <meta property="og:image" content={image} />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content={imageAlt} />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content={url} />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={image} />
    <meta name="twitter:image:alt" content={imageAlt} />
    <link rel="canonical" href={url} />
  </Helmet>
)

export default PageMeta
