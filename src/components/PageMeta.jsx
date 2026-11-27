import { Helmet } from 'react-helmet-async'
import {
  buildStructuredData,
  getCanonicalUrl,
  getMarkdownUrl,
  getRouteMeta,
  serializeJsonLd,
} from '../seo/entity'

const defaultImage = 'https://btuckerc.dev/og/home.jpg'
const defaultImageAlt =
  'Tucker Craig, software engineer. Building my own tools with coding agents.'

const PageMeta = ({
  route,
  title: titleProp,
  description: descriptionProp,
  url: urlProp,
  type: typeProp,
  image: imageProp,
  imageAlt: imageAltProp,
  openGraphDescription: openGraphDescriptionProp,
  structuredData: structuredDataProp,
}) => {
  const meta = route ? getRouteMeta(route) : null
  const title = titleProp ?? meta?.title ?? 'Tucker Craig - btuckerc.dev'
  const description = descriptionProp ?? meta?.description ?? ''
  const url = urlProp ?? (route ? getCanonicalUrl(route) : 'https://btuckerc.dev/')
  const type = typeProp ?? meta?.type ?? 'website'
  const image = imageProp ?? meta?.image ?? defaultImage
  const imageAlt = imageAltProp ?? meta?.imageAlt ?? defaultImageAlt
  const openGraphDescription =
    openGraphDescriptionProp ?? meta?.openGraphDescription ?? description
  const mdUrl = route ? getMarkdownUrl(route) : null
  const structuredData =
    structuredDataProp ?? (route ? buildStructuredData(route) : null)

  return (
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
      {mdUrl && (
        <link rel="alternate" type="text/markdown" href={mdUrl} />
      )}
      {structuredData && (
        <script type="application/ld+json">
          {serializeJsonLd(structuredData)}
        </script>
      )}
    </Helmet>
  )
}

export default PageMeta
