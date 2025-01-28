import { parse } from "path-to-regexp";
import { knownBrands } from "./app/knownBrands.mjs";
import { localizedRewriteSegments } from "./localizedPaths.mjs";
import {
  supportedCountries,
  supportedLocales,
} from "./supportedLocales.next.config.mjs";

import { constants, TimeInSeconds } from "./constants.mjs";

const datoEventService = {
  getAllEventSlugs: async () => {
    return ["black-friday"];
  },
  getAllLegalPages: async () => {
    return ["privacy-policy", "return-policy", "terms-and-conditions"];
  }

}
// const nuxtUrl = `https://dundle.dev`;
// const nuxtUrl = `https://jkldsfsdaf.free.beeceptor.com`;
const nuxtUrl = `https://echo.free.beeceptor.com`;
// const nuxtUrl = `https://nuxt.dundle.com`;
// const nuxtUrl = `https://vercel-next-catch-all.vercel.app`;
// const nuxtUrl = `http://100.68.11.108:3000`; // nuxt on mac directly
// const nuxtUrl = `http://100.68.11.108:3002`; // next on mac directly

const countries = supportedCountries.map((x) => x);
const locales = supportedLocales.map((locale) => locale);

const nextCountrySegment = `:country(${countries.join("|")})`;
const nextLocaleSegment = `:locale(${locales.join("|")})`;

const countrySegment = `:country((?:[a-zA-Z]{2}))`;
const localeSegment = `:locale((?:[a-zA-Z]{2}))`;
const categorySegment = `:category(${localizedRewriteSegments.category.join(
  "|",
)})`;
const legalSegment = `:legal(${localizedRewriteSegments.legal.join("|")})`;
const eventSegment = `:event(${localizedRewriteSegments.events.join("|")})`;
const brandSegment = `:brand(${knownBrands.join("|")})`;
const cartSegment = `:path(${localizedRewriteSegments.cart.join("|")})`;
const checkoutSegment = `:path(${localizedRewriteSegments.checkout.join("|")})`;

const makeDynamic = (rule) => {
  const destinationSegments = rule.destination
    .split("/")
    .filter(Boolean)
    .join("/");

  return [
    {
      ...rule,
      has: [
        {
          type: "query",
          key: constants.UrlParams.USER_PREFERENCES_CURRENCY_QUERY_PARAM,
        },
      ],
      destination: `/${destinationSegments}/${constants.UrlSegmentsForRewriting.DYNAMIC}`,
    },
    {
      ...rule,
      has: [
        {
          type: "query",
          key: constants.UrlParams.COUNTRY_OR_CURRENCY_QUERY_PARAM,
        },
      ],
      destination: `/${destinationSegments}/${constants.UrlSegmentsForRewriting.DYNAMIC}`,
    },
    {
      ...rule,
      has: [
        {
          type: "cookie",
          key: constants.Cookies.VERCEL_FEATURE_FLAGS_OVERRIDE,
        },
      ],
      destination: `/${destinationSegments}/${constants.UrlSegmentsForRewriting.DYNAMIC}`,
    },
    { ...rule },
  ];
};

const makeLocaleDynamic = (rule) => {
  const sourceSegments = rule.source.split("/").filter(Boolean).join("/");
  const destinationSegments = rule.destination
    .split("/")
    .filter(Boolean)
    .join("/");

  return [
    {
      source: `/${nextCountrySegment}/${nextLocaleSegment}/${sourceSegments}`,
      destination: `/:country/:locale/${destinationSegments}`,
    },
    {
      source: `/${nextCountrySegment}/${sourceSegments}`,
      destination: `/:country/${constants.UrlSegmentsForRewriting.DEFAULT_LOCALE_PLACEHOLDER}/${destinationSegments}`,
    },
    {
      source: `/${sourceSegments}`,
      destination: `/us/${constants.UrlSegmentsForRewriting.DEFAULT_LOCALE_PLACEHOLDER}/${destinationSegments}`,
    },
  ];
};

const makeCommerceLayerHybridNavigation = (rule) => {
  const sourceSegments = rule.source.split("/").filter(Boolean).join("/");
  const destinationSegments = rule.destination
    .split("/")
    .filter(Boolean)
    .join("/");

  const path = `/${sourceSegments}`;
  const tokens = parse(path, { end: true });
  const pathKey = tokens[0].name;

  const commerceLayerCountries = ["mt"].map((x) =>
    x.toLowerCase(),
  );
  const countriesWithoutCommerceLayer = countries.filter(
    (countries) => !commerceLayerCountries.includes(countries),
  );

  const nuxtCartCountries = `:country(${countriesWithoutCommerceLayer.join(
    "|",
  )})`;
  const nextCartCountries = `:country(${commerceLayerCountries.join("|")})`;

  return [
    // Give next precedence because the list is shorter
    {
      source: `/${nextCartCountries}/${nextLocaleSegment}/${sourceSegments}/`,
      destination: `/:country/:locale/${destinationSegments}`,
    },
    {
      source: `/${nextCartCountries}/${sourceSegments}`,
      destination: `/:country/${constants.UrlSegmentsForRewriting.DEFAULT_LOCALE_PLACEHOLDER}/${destinationSegments}/`,
    },
    {
      source: `/${nuxtCartCountries}/${nextLocaleSegment}/${sourceSegments}`,
      destination: `${nuxtUrl}/:country/:locale/:${pathKey}/`,
    },
    {
      source: `/${nuxtCartCountries}/${sourceSegments}`,
      destination: `${nuxtUrl}/:country/:${pathKey}/`,
    },
    // the default is a fallback to the nuxt cart
    {
      source: `/${sourceSegments}`,
      destination: `${nuxtUrl}/:${pathKey}/`,
    },
  ];
};

const makeLocaleDynamicWithRules = (rule) => {
  const localeRules = makeLocaleDynamic(rule);
  return localeRules.flatMap((rule) => makeDynamic(rule));
};

const vercelCDNCacheControlHeaders = (cache, swr) => [
  {
    key: "Vercel-CDN-Cache-Control",
    value: `max-age=${cache}, stale-while-revalidate=${swr}`,
  },
];
const getCspHeader = () => {
  return `default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'`;
};
/** @type {import('next').NextConfig}  */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  logging: {
    fetches: {
      fullUrl: false,
    },
  },
  experimental: {
    optimizePackageImports: ["ua-parser-js"],
    serverActions: {
      allowedOrigins: [nuxtUrl],
    },
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // webpack: (
  //   config,
  //   { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack },
  // ) => {
  //   if (dev) {
  //     config.plugins.push(
  //       new WebpackHookPlugin({
  //         onBuildStart: ["npx @spotlightjs/spotlight"],
  //       }),
  //     );
  //   }

  //   return config;
  // },
  eslint: {
    ignoreDuringBuilds: true,
  },
  transpilePackages: ["ui"],
  headers: async () => {
    return [
      {
        source: `/:country((?:[a-zA-Z]{2})?)/:locale((?:[a-zA-Z]{2})?)/:path(${knownBrands.join(
          "|",
        )})`,
        headers: vercelCDNCacheControlHeaders(
          TimeInSeconds.TWO_MINUTE,
          TimeInSeconds.SIX_HOURS,
        ),
        missing: [
          {
            type: "cookie",
            key: constants.Cookies.VERCEL_FEATURE_FLAGS_OVERRIDE,
          },
        ],
      },
      {
        source: `/:country((?:[a-zA-Z]{2})?)/:path(${knownBrands.join("|")})`,
        headers: vercelCDNCacheControlHeaders(
          TimeInSeconds.TWO_MINUTE,
          TimeInSeconds.SIX_HOURS,
        ),
        missing: [
          {
            type: "cookie",
            key: constants.Cookies.VERCEL_FEATURE_FLAGS_OVERRIDE,
          },
        ],
      },
      {
        source: `/:path(${knownBrands.join("|")})`,
        headers: vercelCDNCacheControlHeaders(
          TimeInSeconds.TWO_MINUTE,
          TimeInSeconds.SIX_HOURS,
        ),
        missing: [
          {
            type: "cookie",
            key: constants.Cookies.VERCEL_FEATURE_FLAGS_OVERRIDE,
          },
        ],
      },
      {
        source: `/:country((?:[a-zA-Z]{2})?)/:locale((?:[a-zA-Z]{2})?)/:path(account/*|legal/*)`,
        headers: vercelCDNCacheControlHeaders(
          TimeInSeconds.ONE_HOUR,
          TimeInSeconds.SIX_HOURS,
        ),
        missing: [
          {
            type: "cookie",
            key: constants.Cookies.VERCEL_FEATURE_FLAGS_OVERRIDE,
          },
        ],
      },
      {
        source: `/:country((?:[a-zA-Z]{2})?)/:path(account/*|legal/*)`,
        headers: vercelCDNCacheControlHeaders(
          TimeInSeconds.ONE_HOUR,
          TimeInSeconds.SIX_HOURS,
        ),
        missing: [
          {
            type: "cookie",
            key: constants.Cookies.VERCEL_FEATURE_FLAGS_OVERRIDE,
          },
        ],
      },
      {
        source: `/:path(account/*|legal/*)`,
        headers: vercelCDNCacheControlHeaders(
          TimeInSeconds.ONE_HOUR,
          TimeInSeconds.SIX_HOURS,
        ),
        missing: [
          {
            type: "cookie",
            key: constants.Cookies.VERCEL_FEATURE_FLAGS_OVERRIDE,
          },
        ],
      },
      {
        source: `/:country((?:[a-zA-Z]{2})?)/:locale((?:[a-zA-Z]{2})?)/${categorySegment}/:path*`,
        headers: vercelCDNCacheControlHeaders(
          TimeInSeconds.ONE_HOUR,
          TimeInSeconds.SIX_HOURS,
        ),
        missing: [
          {
            type: "cookie",
            key: constants.Cookies.VERCEL_FEATURE_FLAGS_OVERRIDE,
          },
        ],
      },
      {
        source: `/:country((?:[a-zA-Z]{2})?)/${categorySegment}/:path*`,
        headers: vercelCDNCacheControlHeaders(
          TimeInSeconds.ONE_HOUR,
          TimeInSeconds.SIX_HOURS,
        ),
        missing: [
          {
            type: "cookie",
            key: constants.Cookies.VERCEL_FEATURE_FLAGS_OVERRIDE,
          },
        ],
      },
      {
        source: `/${categorySegment}/:path*`,
        headers: vercelCDNCacheControlHeaders(
          TimeInSeconds.ONE_HOUR,
          TimeInSeconds.SIX_HOURS,
        ),
        missing: [
          {
            type: "cookie",
            key: constants.Cookies.VERCEL_FEATURE_FLAGS_OVERRIDE,
          },
        ],
      },
      {
        source: `/magazine/:path*`,
        headers: vercelCDNCacheControlHeaders(
          TimeInSeconds.ONE_HOUR,
          TimeInSeconds.ONE_DAY,
        ),
      },
      {
        source: "/_nuxt/:path*",
        headers: [
          {
            key: "Vercel-CDN-Cache-Control",
            value: `public, max-age=${constants.TimeInSeconds.ONE_DAY}, stale-while-revalidate=${constants.TimeInSeconds.ONE_DAY}`,
          },
        ],
      },
      {
        source: "/:path*",
        has: [
          {
            type: "query",
            key: constants.UrlParams.COUNTRY_OR_CURRENCY_QUERY_PARAM,
          },
        ],
        headers: [
          {
            key: constants.Headers.REWRITE_HEADER,
            value: `queryParam ${constants.UrlParams.COUNTRY_OR_CURRENCY_QUERY_PARAM}`,
          },
        ],
      },
      {
        source: "/:path*",
        has: [
          {
            type: "query",
            key: constants.UrlParams.USER_PREFERENCES_CURRENCY_QUERY_PARAM,
          },
        ],
        headers: [
          {
            key: constants.Headers.REWRITE_HEADER,
            value: `queryParam ${constants.UrlParams.USER_PREFERENCES_CURRENCY_QUERY_PARAM}`,
          },
        ],
      },
      {
        source: "/:path*",
        missing: [
          {
            type: "cookie",
            key: constants.Cookies.COOKIEBOT_COOKIES_ACCEPTED,
          },
        ],
        headers: [
          {
            key: constants.Headers.REWRITE_HEADER,
            value: "cookie missing",
          },
        ],
      },
      {
        source: "/:path*",
        has: [
          {
            type: "cookie",
            key: constants.Cookies.VERCEL_FEATURE_FLAGS_OVERRIDE,
          },
        ],
        headers: [
          {
            key: constants.Headers.REWRITE_HEADER,
            value: "feature flag enabled",
          },
        ],
      },
      {
        source: "/(.*)",
        headers: [
          {
            key: constants.Headers.CSP,
            value: getCspHeader(),
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        destination: "/:path*/?c=",
        has: [
          {
            type: "query",
            key: "c",
            value: "(.{4,})",
          },
        ],
        permanent: true,
      },
      {
        source: "/:path*",
        destination: "/:path*/?currency=",
        has: [
          {
            type: "query",
            key: "currency",
            value: "(.{4,})",
          },
        ],
        permanent: true,
      },
      {
        source: `/${countrySegment}/${localeSegment}/${categorySegment}/`,
        destination: "/:country/:locale/",
        permanent: true,
      },
      {
        source: `/${countrySegment}/${categorySegment}/`,
        destination: "/:country/",
        permanent: true,
      },
      {
        source: `/${categorySegment}/`,
        destination: "/",
        permanent: true,
      },
      {
        source: `/meta__feed__sitemap__dundle-next__sitemap.xml`,
        destination: "/meta/feed/sitemap/dundle-next/sitemap.xml",
        permanent: true,
      },
      {
        source: `/${countrySegment}/${localeSegment}/cookie`,
        destination: "/:country/:locale",
        permanent: true,
      },
      {
        source: `/${countrySegment}/cookie`,
        destination: "/:country",
        permanent: true,
      },
      {
        source: `/${countrySegment}/${localeSegment}/${categorySegment}/event/event/:path*`,
        destination: "/:country/:locale/events/:path*",
        permanent: true,
      },
      {
        source: `/${countrySegment}/${categorySegment}/event/event/:path*`,
        destination: "/:country/events/:path*",
        permanent: true,
      },
      {
        source: `/${categorySegment}/event/event/:path*`,
        destination: "/events/:path*",
        permanent: true,
      },
      {
        source: `/magazine/`,
        destination: `/magazine/en/`,
        permanent: true,
      },
    ];
  },
  async rewrites() {
    const eventSlugsRes = await datoEventService.getAllEventSlugs();
    const eventSlugs = eventSlugsRes?.join("|") || "black-friday";

    const legalPages = await datoEventService.getAllLegalPages();
    const legalSlugs = legalPages?.join("|");

    return {
      beforeFiles: [
        {
          source: "/_nuxt/:path*",
          destination: `${nuxtUrl}/_nuxt/:path*`,
        },
        {
          source: "/magazine/_nuxt/:path*",
          destination: `${nuxtUrl}/magazine/_nuxt/:path*`,
        },
        {
          source: "/resources/:path*",
          destination: `https://images.dundle.com/resources/:path*`,
        },
        {
          source: "/manifest.webmanifest",
          destination: `${nuxtUrl}/manifest.webmanifest`,
        },
        {
          source: `/magazine/:path*`,
          destination: `${nuxtUrl}/magazine/:path*/`,
        },
      ],
      // Rewrite rules most specific first
      afterFiles: [
        ...makeCommerceLayerHybridNavigation({
          source: `/${cartSegment}`,
          destination: "/cart/",
        }),
        ...makeCommerceLayerHybridNavigation({
          source: `/${checkoutSegment}`,
          destination: "/payment/",
        }),
        // eventsRewrites,
        ...makeLocaleDynamic({
          source: `/${eventSegment}/:path(${eventSlugs})`,
          destination: "/category/event/event/:path*/",
        }),
        // categoryAndSubCategoryRewrites,
        ...makeLocaleDynamic({
          source: `/${categorySegment}/:path*`,
          destination: "/category/:path*/",
        }),
        // legal pages
        ...makeLocaleDynamic({
          source: `/${legalSegment}/:path(${legalSlugs})`,
          destination: "/legal/:path/",
        }),
        // search page
        ...makeLocaleDynamic({
          source: `/search-relewise/`,
          destination: "/search/",
        }),
        // brand page
        ...makeLocaleDynamicWithRules({
          source: `/${brandSegment}`,
          destination: `/brand/:brand/`,
        }),
        // account page
        ...makeLocaleDynamicWithRules({
          source: `/account/:path*`,
          destination: `/account/:path*/`,
        }),
        
        // homepage
        ...makeLocaleDynamicWithRules({
          source: `/`,
          destination: `/`,
        }),
        ...makeLocaleDynamic({
          source:
            "/:legal(legal|lainmukainen)/:slug(privacybeleid|privacy|privacy-policy|tietosuojailmoitus|informativa-sulla-privacy|privacidade)",
          destination: "/legal/privacy-policy",
        }),
        ...makeLocaleDynamic({
          source:
            "/:legal(legal)/:slug(returnpolicy|returnpolicy_fr|return-policy|devolucao)",
          destination: "/legal/return-policy",
        }),
        ...makeLocaleDynamic({
          source:
            "/:legal(legal)/:slug(algemenevoorwaarden|terms-and-conditions|condiciones-generales|termos-e-condicoes)",
          destination: "/legal/terms-and-conditions",
        }),
        {
          source: "/:path*",
          destination: `${nuxtUrl}/:path*/`,
          missing: [
            {
              type: "query",
              key: "_rsc",
            },
          ],
        },
      ],
      fallback: [
        {
          source: "/:path*",
          destination: `${nuxtUrl}/:path*/`,
        },
      ],
    };
  },
};

export default nextConfig;
