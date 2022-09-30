import React from 'react'
import { Helmet } from 'react-helmet'

export const Meta = ({ title, description, keywords }) => {
    return <Helmet>
        <title>{title}</title>
        <meta name="description" content={description}></meta>
        <meta name="keyword" content={keywords}></meta>
    </Helmet>
}

Meta.defaultProps = {
    title: 'Welcome to Shopiz',
    description: 'We Sell the best products for cheap',
    keywords: 'We Sell the best products for cheapelectronic, buyelectronics'

}

export default Meta
