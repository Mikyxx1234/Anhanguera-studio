import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: string;
}

export default function SEOHead({ 
  title, 
  description, 
  path, 
  image = 'https://images.pexels.com/photos/5940721/pexels-photo-5940721.jpeg?auto=compress&cs=tinysrgb&w=1200',
  type = 'website'
}: SEOHeadProps) {
  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://site-completo-faculd-tz0s.bolt.host';
  const canonicalUrl = `${siteUrl}${path}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content="Anhanguera" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:url" content={canonicalUrl} />
      
      {/* Additional SEO Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content="Anhanguera" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </Helmet>
  );
}