import React, { useEffect } from 'react';

export interface SEOHeadProps {
  title: string;
  description: string;
  canonicalUrl?: string;
  canonicalPath?: string;
  ogType?: 'website' | 'article';
  ogImage?: string;
  schema?: Record<string, any> | Record<string, any>[];
  noIndex?: boolean;
}

const BASE_CANONICAL = 'https://www.dpskilltech.in';
const DEFAULT_IMAGE = 'https://www.dpskilltech.in/images/dp-skilltech-logo-full.png';

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  canonicalUrl,
  canonicalPath,
  ogType = 'website',
  ogImage = DEFAULT_IMAGE,
  schema,
  noIndex = false
}) => {
  useEffect(() => {
    // 1. Update Document Title
    document.title = title;

    // Helper: update or create meta tag by attribute
    const setMetaTag = (attrName: string, attrValue: string, content: string) => {
      let element = document.querySelector(`meta[${attrName}="${attrValue}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 2. Meta Description
    setMetaTag('name', 'description', description);

    // 3. Robots
    setMetaTag('name', 'robots', noIndex ? 'noindex, nofollow' : 'index, follow');

    // 4. Canonical URL
    const targetCanonical = canonicalUrl || canonicalPath;
    const finalCanonical = targetCanonical
      ? (targetCanonical.startsWith('http')
          ? targetCanonical
          : `${BASE_CANONICAL}${targetCanonical.startsWith('/') ? '' : '/'}${targetCanonical}`)
      : `${BASE_CANONICAL}${window.location.pathname}`;

    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', finalCanonical);

    // 5. Open Graph Meta Tags
    setMetaTag('property', 'og:title', title);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:url', finalCanonical);
    setMetaTag('property', 'og:type', ogType);
    setMetaTag('property', 'og:image', ogImage);
    setMetaTag('property', 'og:site_name', 'DP Skill Tech');

    // 6. Twitter Meta Tags
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', title);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', ogImage);

    // 7. Structured Data (JSON-LD)
    const existingScript = document.getElementById('seo-dynamic-jsonld');
    if (existingScript) {
      existingScript.remove();
    }

    if (schema) {
      const script = document.createElement('script');
      script.id = 'seo-dynamic-jsonld';
      script.type = 'application/ld+json';
      const formattedSchema = Array.isArray(schema)
        ? {
            '@context': 'https://schema.org',
            '@graph': schema
          }
        : {
            '@context': 'https://schema.org',
            ...schema
          };
      script.textContent = JSON.stringify(formattedSchema, null, 2);
      document.head.appendChild(script);
    }

    return () => {
      // Cleanup dynamically injected JSON-LD on unmount
      const cleanupScript = document.getElementById('seo-dynamic-jsonld');
      if (cleanupScript) {
        cleanupScript.remove();
      }
    };
  }, [title, description, canonicalUrl, canonicalPath, ogType, ogImage, schema, noIndex]);

  return null;
};
