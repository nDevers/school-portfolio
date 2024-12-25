'use server';

import environments from "@/constants/enviornments.constants";

import readFileContent from "@/util/readFileContent";
import getEnvironmentData from "@/util/getEnvironmentData";

/**
 * Extracts and returns the details of an author or their contact information.
 *
 * This function retrieves relevant data regarding an author, including their name,
 * portfolio link, contact details such as email and mobile number, and social media links.
 * If any of the fields are missing, default values such as `null` will be assigned.
 *
 * @param {Object} author - The object containing author information and their details.
 * @param {string} [author.name] - The name of the author.
 * @param {string} [author.portfolio] - The portfolio link of the author.
 * @param {Object} [author.contact] - The object containing the author's contact information.
 * @param {string} [author.contact.email] - The email address of the author.
 * @param {string} [author.contact.mobile] - The mobile number of the author.
 * @param {Object} [author.social] - The author's social media information.
 * @returns {Object} An object containing the author's details:
 *                   - `name`: The name of the author.
 *                   - `portfolio`: The portfolio link or `null`.
 *                   - `contact`: An object with `email` and `mobile` values or `null`.
 *                   - `social`: The processed social media links.
 */
const getAuthorOrContactDetails = (author) => ({
  name: author?.name,
  portfolio: author?.portfolio || null,

  contact: {
    email: author?.contact?.email || null,
    mobile: author?.contact?.mobile || null,
  },

  social: getSocialLinks(author?.social),
});

/**
 * Extracts and returns social media links from the provided object.
 *
 * @function
 * @param {Object} social - An object containing social media links.
 * @param {string} [social.linkedIn] - The LinkedIn profile link (optional).
 * @param {string} [social.gitHub] - The GitHub profile link (optional).
 * @param {string} [social.x] - The X (formerly Twitter) profile link (optional).
 * @param {string} [social.facebook] - The Facebook profile link (optional).
 * @param {string} [social.instagram] - The Instagram profile link (optional).
 * @returns {Object} An object containing the extracted social media links with default values as null if not provided.
 */
const getSocialLinks = (social) => ({
  linkedIn: social?.linkedIn || null,
  gitHub: social?.gitHub || null,
  x: social?.x || null,
  facebook: social?.facebook || null,
  instagram: social?.instagram || null,
});

/**
 * Represents the content of the `package.json` file read from the file system.
 *
 * The variable holds a string containing the contents of the `package.json`
 * file located at the defined path. The content is retrieved asynchronously
 * using the `readFileContent` function.
 *
 * @type {string}
 */
const packageJsonFileContent = await readFileContent(
  "./package.json",
  true,
);

/**
 * Asynchronous configuration object that provides data for various application configurations.
 */
const configurations = async () => ({
  // Environment Configuration
  env: getEnvironmentData("NODE_ENV") || environments.DEVELOPMENT,

  // API Configuration
  api: {
    name: packageJsonFileContent?.name || null,
    version: packageJsonFileContent?.version || null,
    license: packageJsonFileContent?.license || null,
    description: packageJsonFileContent?.description || null,

    engines: {
      node: packageJsonFileContent?.engines?.node || null,
      npm: packageJsonFileContent?.engines?.npm || null,
    },

    details: {
      repository: packageJsonFileContent?.repository || null,
      homepage: packageJsonFileContent?.homepage || null,
      issues: packageJsonFileContent?.issues || null,
      bugs: packageJsonFileContent?.bugs || null,
      termsOfService: packageJsonFileContent?.termsOfService || null,

      documentation: {
        docs: packageJsonFileContent?.documentation?.docs || null,
        swagger: packageJsonFileContent?.documentation?.swagger || null,
        tutorials: packageJsonFileContent?.documentation?.tutorials || null,
      }
    },
  },

  // Contact Information
  contact: {
    owner: {
      email: getEnvironmentData("CONTACT_EMAIL"),
      mobile: getEnvironmentData("CONTACT_MOBILE"),
    },

    support: {
      email: getEnvironmentData("SUPPORT_EMAIL"),
      mobile: getEnvironmentData("SUPPORT_MOBILE"),
    },

    admin: {
      email: getEnvironmentData("SUPPORT_EMAIL"),
      mobile: getEnvironmentData("SUPPORT_MOBILE"),
    },

    social: getSocialLinks({
      linkedIn: getEnvironmentData("SOCIAL_MEDIA_LINKEDIN"),
      gitHub: getEnvironmentData("SOCIAL_MEDIA_GITHUB"),
      x: getEnvironmentData("SOCIAL_MEDIA_X"),
      facebook: getEnvironmentData("SOCIAL_MEDIA_FACEBOOK"),
      instagram: getEnvironmentData("SOCIAL_MEDIA_INSTAGRAM"),
    }),
  },

  // Author Information
  author: getAuthorOrContactDetails(packageJsonFileContent?.author),

  // Server Configuration

  // Timeout Configuration
  timeout: parseInt(getEnvironmentData("TIMEOUT_IN_SECONDS") || "0", 10) || 60,

  // Payload Configuration
  jsonPayloadLimit: parseInt(getEnvironmentData("JSON_PAYLOAD_LIMIT_IN_KB") || "0", 10) || 60,

  // CORS Configuration
  cors: {
    allowedMethods: getEnvironmentData("CORS_ALLOWED_METHODS"),
    allowedOrigins: getEnvironmentData("CORS_ALLOWED_ORIGIN")?.split(",") || [],
  },

  // Database Configuration
  database: {
    mongodb: {
      protocol: getEnvironmentData("MONGODB_DATABASE_PROTOCOL") || "",
      username: getEnvironmentData("MONGODB_DATABASE_USERNAME") || "",
      password: getEnvironmentData("MONGODB_DATABASE_PASSWORD") || "",
      clusterHost: getEnvironmentData("MONGODB_DATABASE_CLUSTER_HOST") || "",
      databaseName: getEnvironmentData("MONGODB_DATABASE_DATABASE_NAME") || "",
      options: getEnvironmentData("MONGODB_DATABASE_OPTIONS") || "",
      connectionString: `${getEnvironmentData("MONGODB_DATABASE_PROTOCOL")}://${getEnvironmentData("MONGODB_DATABASE_USERNAME")}:${getEnvironmentData("MONGODB_DATABASE_PASSWORD")}@${getEnvironmentData("MONGODB_DATABASE_CLUSTER_HOST")}/${getEnvironmentData("MONGODB_DATABASE_DATABASE_NAME")}?${getEnvironmentData("MONGODB_DATABASE_OPTIONS")}`,
    }
  },

  // Authentication Configuration
  authentication: {
    maximumLoginAttempts: parseInt(getEnvironmentData("AUTH_MAXIMUM_LOGIN_ATTEMPTS") || "0", 10) || 5,
    maximumResetPasswordAttempts: parseInt(getEnvironmentData("AUTH_MAXIMUM_RESET_PASSWORD_ATTEMPTS") || "0", 10) || 5,
    maximumVerifyEmailAttempts: parseInt(getEnvironmentData("AUTH_MAXIMUM_VERIFY_EMAIL_ATTEMPTS") || "0", 10) || 5,
    maximumChangeEmailAttempts: parseInt(getEnvironmentData("AUTH_MAXIMUM_CHANGE_EMAIL_ATTEMPTS") || "0", 10) || 5,
    maximumChangeMobileAttempts: parseInt(getEnvironmentData("AUTH_MAXIMUM_CHANGE_MOBILE_ATTEMPTS") || "0", 10) || 5,
    maximumChangePasswordAttempts: parseInt(getEnvironmentData("AUTH_MAXIMUM_CHANGE_PASSWORD_ATTEMPTS") || "0", 10) || 5,
    maximumActiveSessions: parseInt(getEnvironmentData("AUTH_MAXIMUM_ACTIVE_SESSIONS") || "0", 10) || 5,
    accountLockDuration: parseInt(getEnvironmentData("AUTH_ACCOUNT_LOCK_DURATION_HOUR") || "0", 10) || 24,
  },

  // JWT Configuration
  jwt: {
    accessToken: {
      secret: getEnvironmentData("JWT_ACCESS_TOKEN_SECRET"),
      expiration: parseInt(getEnvironmentData("JWT_ACCESS_TOKEN_EXPIRATION_IN_MINUTES")),
    },
    refreshToken: {
      secret: getEnvironmentData("JWT_REFRESH_TOKEN_SECRET"),
      expiration: parseInt(getEnvironmentData("JWT_REFRESH_TOKEN_EXPIRATION_IN_MINUTES")),
    },
    resetPasswordToken: {
      secret: getEnvironmentData("JWT_RESET_PASSWORD_TOKEN_SECRET"),
      expiration: parseInt(getEnvironmentData("JWT_RESET_PASSWORD_TOKEN_EXPIRATION_IN_MINUTES")),
    },
    verifyEmailToken: {
      secret: getEnvironmentData("JWT_VERIFY_EMAIL_TOKEN_SECRET"),
      expiration: parseInt(getEnvironmentData("JWT_VERIFY_EMAIL_TOKEN_EXPIRATION_IN_MINUTES")),
    },
  },

  // Rate Limit Configuration
  rateLimit: {
    limit: getEnvironmentData("RATE_LIMIT_TOTAL_REQUESTS"),
    windowMs: getEnvironmentData("RATE_LIMIT_WINDOW_IN_MS"),
    message: getEnvironmentData("RATE_LIMIT_MESSAGE"),
    headers: getEnvironmentData("RATE_LIMIT_HEADERS") === "true",
  },

  // Cookies Configuration
  cookies: {
    secure: getEnvironmentData("COOKIE_SECURE") === "true",
    sameSite: getEnvironmentData("COOKIE_SAME_SITE") === "true",
    httpOnly: getEnvironmentData("COOKIE_HTTP_ONLY") === "true",
    maxAge: parseInt(getEnvironmentData("COOKIE_MAX_AGE_IN_SECONDS") || "0", 10) || 60 * 60 * 24,
    userTokenName: getEnvironmentData("COOKIE_USER_TOKEN_NAME"),
  },

  // Cache Configuration
  cache: {
    maxAge: parseInt(getEnvironmentData("CACHE_TTL_IN_SECONDS") || "0", 10) || 60 * 60 * 24,
  },

  // Email Configuration
  email: {
    smtp: {
      host: getEnvironmentData("EMAIL_SMTP_HOST"),
      port: getEnvironmentData("EMAIL_SMTP_PORT"),
      auth: {
        user: getEnvironmentData("EMAIL_SMTP_USERNAME"),
        pass: getEnvironmentData("EMAIL_SMTP_PASSWORD"),
      },
      maxConnectionAttempts: parseInt(getEnvironmentData("EMAIL_SMTP_MAX_CONNECTION_RETRY_ATTEMPTS") || "0", 10) || 5,
    },
    from: getEnvironmentData("EMAIL_FROM"),
  },

  // Google Drive Configuration
  googleDrive: {
    clientEmail: getEnvironmentData("GOOGLE_DRIVE_CLIENT_EMAIL"),
    folderKey: getEnvironmentData("GOOGLE_DRIVE_FOLDER_KEY"),
    privateKey: getEnvironmentData("GOOGLE_DRIVE_PRIVATE_KEY"),
    scope: getEnvironmentData("GOOGLE_DRIVE_SCOPE"),
  },

  // Admin Configuration
  systemAdmin: {
    email: getEnvironmentData("SYSTEM_ADMIN_EMAIL"),
    password: getEnvironmentData("SYSTEM_ADMIN_PASSWORD"),
  }
});

export default configurations;
