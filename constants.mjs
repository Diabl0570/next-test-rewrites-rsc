export const TimeInSeconds = {
  ONE_MINUTE: 60,
  TWO_MINUTE: 120,
  FIVE_MINUTES: 300,
  THIRTY_MINUTES: 1800,
  ONE_HOUR: 3600,
  SIX_HOURS: 21600,
  TWELVE_HOURS: 43200,
  ONE_DAY: 86400,
  TWO_DAYS: 172800,
  ONE_WEEK: 604800,
  FOURTEEN_DAYS: 1209600,
  ONE_YEAR: 31536000,
};

/**
 * URL parameters
 */
const UrlParams = {
  /**
   * ?c= query param is used to display the current product in a different country or currency
   */
  COUNTRY_OR_CURRENCY_QUERY_PARAM: "c",
  /**
   * ?currency= is used for currency query param
   */
  USER_PREFERENCES_CURRENCY_QUERY_PARAM: "currency",
};

/**
 * Warning: make sure to update the file based routes when changing the values
 */
const UrlSegmentsForRewriting = {
  DYNAMIC: "dynamic",
  COOKIE: "cookie",
  DEFAULT_LOCALE_PLACEHOLDER: "default",
  STATIC_ROUTE_GROUP: "(static)",
  BRAND: "brand",
};

/**
 * Headers
 */
const Headers = {
  REWRITE_HEADER: "x-rewrite",
  IP_COUNTRY: "X-Vercel-IP-Country",
  REFERER: "Referer",
  CSP: "Content-Security-Policy",
  X_REAL_IP: "X-Real-IP",
  X_FORWARDED_FOR: "x-forwarded-for",
  /**
   * If the request is coming from Cloudflare, this header will contain the IP address of the client
   */
  CLOUDFLARE_CONNECTING_IP: "CF-Connecting-IP",
  CLOUDFLARE_IP_COUNTRY: "CF-IPCountry",
};

/**
 * Cookies
 */
const Cookies = {
  COMMERCELAYER_ORDER_ID: "commercelayer.order.id",
  COOKIES_ACCEPTED: "cookiesAccepted",
  DUNDLE_FINGERPRINT: "dundle.fingerprint",
  DUNDLE_IP_COUNTRY: "dundle.ip.country",
  /**
   * This is for testing/debugging GEO IP country, can be removed (with all references) when DEV-5866 is done
   */
  DUNDLE_IP_COUNTRY_INITIAL: "dundle.ip.country.initial",
  X_IP_COUNTRY: "dundle.ip.country.x",
  DUNDLE_SESSION_ID: "dundle.session.id",
  COOKIEBOT_COOKIES_ACCEPTED: "CookieConsent",
  VERCEL_FEATURE_FLAGS_OVERRIDE: "vercel-flag-overrides",
  VISIT_ID: "dundle.visitId",
};

/**
 * Session storage
 */
const SessionStorage = {
  PROMOTION: "dundle.promotion",
};

/**
 * URLs
 */
const Urls = {
  DUNDLE_URL: "https://www.dundle.com",
  DUNDLE_MAGAZINE_URL: "https://www.dundle.com/magazine/en",
  SOCIAL_URL_FACEBOOK: "https://www.facebook.com/DundleCom",
  SOCIAL_URL_INSTAGRAM: "https://www.instagram.com/dundle_com/",
  SOCIAL_URL_LINKEDIN: "https://www.linkedin.com/company/dundle/",
  SOCIAL_URL_TWITTER: "https://twitter.com/Dundle_com",
  URL_APP_STORE_PATH: "/app/dundle-prepaid-cards-egifts/id1605958640",
  URL_APP_STORE_DOMAIN: "https://apps.apple.com/",
  URL_PLAY_STORE:
    "https://play.google.com/store/apps/details?id=com.dundle.app&referrer=utm_source%3Dwebsite%26utm_medium%3Dhomepage_banner%26utm_term%3Dapp_campaign%26anid%3Dadmob",
};

/**
 * Cart and SKU related constants
 */
const CartSku = {
  MAXIMUM_QUANTITY_PER_SKU: 9,
};

/**
 * Trustpilot related constants
 */
const Trustpilot = {
  MAX_SKUS_FOR_TRUSTPILOT: 50,
};

const Analytics = {
  DESKTOP: "desktop",
  UNKNOWN: "UNKNOWN",
};

const EdgeConfigStoreItemNames = {
  BMS_COGNITO_TOKEN: "BMS_COGNITO_TOKEN",
  ORDERS_COGNITO_TOKEN: "ORDERS_COGNITO_TOKEN",
};

/**
 * DatoCMS type names
 */
const DatocmsRecordNames = {
  BRAND_RECORD: "BrandRecord",
  FREQUENTLY_ASKED_QUESTION_LIST_BLOCK:
    "FrequentlyAskedQuestionListBlockRecord",
  IMAGE_BLOCK_RECORD: "ImageBlockRecord",
  NOTIFICATION_BLOCK: "NotificationBlockRecord",
  BRAND_COLLECTION_BLOCK_RECORD: "BrandCollectionBlockRecord",
  REGIONAL_LINK_RECORD: "RegionalLinkRecord",
};

/**
 * Main categories
 */
const MainCategories = ["paymentcards", "giftcards", "prepaid", "gamecards"];

/**
 * We want to always have a fallback for the developer's location
 */
const DefaultDeveloperGeoLocation = "NL";

const UserPreferences = {
  CURRENCY: "currency",
  COUNTRY: "country",
  LANGUAGE: "language",
};

const MetaData = {
  NO_INDEX: "noindex, nofollow",
  INDEX: "index, follow",
};

export const constants = {
  Analytics,
  CartSku,
  Cookies,
  DatocmsTypeNames: DatocmsRecordNames,
  DefaultDeveloperGeoLocation,
  EdgeConfigStoreItemNames,
  Headers,
  MainCategories,
  MetaData,
  SessionStorage,
  TimeInSeconds,
  Trustpilot,
  UrlParams,
  Urls,
  UrlSegmentsForRewriting,
  UserPreferences,
};
