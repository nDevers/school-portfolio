'use strict';

/**
 * A constant variable representing the value 100, commonly used to indicate
 * the continuation or progression of a process within an application.
 *
 * @constant {number} CONTINUE
 * @default 100
 */
const CONTINUE = 100;

/**
 * HTTP status code indicating that the server is switching protocols as requested by the client.
 * This status code is used in response to an `Upgrade` request header and signals that the protocol
 * change has been accepted and will be performed. The new protocol must be agreed upon between the client
 * and the server.
 *
 * Value: 101
 */
const SWITCHING_PROTOCOLS = 101;

/**
 * Represents the status code for a processing state.
 *
 * The `PROCESSING` variable is typically used to indicate that an operation or request
 * is in progress and has not yet been completed. This can be useful in various
 * contexts where tracking the state of execution or requests is necessary.
 *
 * Value: 102
 */
const PROCESSING = 102;

/**
 * The HTTP status code 103 represents "Early Hints".
 *
 * This status code is primarily used to hint the client, typically a browser, to start
 * preloading resources while the server completes preparation and sending of the final response.
 * It allows the client to perform certain tasks earlier, such as fetching linked resources,
 * improving perceived performance and reducing latency.
 *
 * The value of `EARLY_HINTS` is set to the integer 103, corresponding to the HTTP status code.
 */
const EARLY_HINTS = 103;

/**
 * The HTTP status code representing a successful request.
 *
 * Value: 200
 */
const OK = 200;

/**
 * Constant representing the HTTP status code for "Created".
 *
 * The value of this constant is 201, which signifies that the
 * request has been fulfilled and resulted in the creation of a new resource.
 * Typically used in HTTP responses for successful POST requests.
 *
 * @constant {number}
 */
const CREATED = 201;

/**
 * Represents the HTTP status code for "Accepted".
 *
 * The value 202 indicates that the request has been received and understood,
 * and it has been accepted for processing, but the processing has not been
 * completed. It is typically returned for asynchronous operations.
 *
 * @constant {number}
 * @default 202
 */
const ACCEPTED = 202;

/**
 * Represents the HTTP status code 203, which indicates that the request was successful but the
 * information returned may come from a source other than the original server. This status
 * is used when the returned meta-information in the response header is not identical to that
 * available from the original server but collected from a local or a third-party copy.
 */
const NON_AUTHORITATIVE_INFORMATION = 203;

/**
 * Indicates that the server successfully processed the request,
 * but is not returning any content.
 * Commonly used as an HTTP status code (204 No Content).
 *
 * Value: 204
 */
const NO_CONTENT = 204;

/**
 * Represents the HTTP status code 205 Reset Content.
 *
 * This status code indicates that the server has successfully processed the request
 * and the user agent should reset the view that caused the request to be sent.
 * Typically used in cases where the response requires the user interface to be reset
 * without changing the document content.
 *
 * Commonly associated with form submissions where a clear or reset action is needed
 * after the server processes the request successfully.
 *
 * Defined by the HTTP/1.1 specification.
 *
 * @type {number}
 */
const RESET_CONTENT = 205;

/**
 * The PARTIAL_CONTENT constant represents the HTTP status code 206.
 * It indicates that the server has successfully processed a partial GET request
 * and is delivering only a portion of the requested resource.
 *
 * This status code is commonly used when a user requests a specific
 * range of bytes from a file or when working with range headers to
 * facilitate downloading parts of large files.
 *
 * Value: 206
 */
const PARTIAL_CONTENT = 206;

/**
 * Represents the HTTP status code for "207 Multi-Status".
 * This status code is primarily used in WebDAV responses, indicating
 * that multiple operations have been applied to a set of resources,
 * and each operation may have resulted in different status codes.
 * The response body typically contains an XML message providing detailed
 * status for each resource involved.
 *
 * Value: 207
 */
const MULTI_STATUS = 207;

/**
 * Represents the HTTP status code 208, which indicates that the members of a DAV binding have already been enumerated
 * in a previous reply to this request, and are not being included again.
 * Typically used in the context of WebDAV to reduce the size of a response when the same resources have already
 * been reported in a preceding part of the multi-status response.
 */
const ALREADY_REPORTED = 208;

/**
 * Represents a constant value used for a specific purpose within the application.
 *
 * The variable `IM_USED` holds the numeric value 226 which could be applied
 * as a constant configuration, status code, identifier, or any other relevant
 * semantic in the context of the application.
 *
 * Note: Modify with caution as this value may have significant implications
 * in other parts of the application.
 *
 * @constant
 * @type {number}
 * @default 226
 */
const IM_USED = 226;

/**
 * HTTP status code indicating that multiple options for the requested resource
 * are available, and the user-agent or user should choose one of them.
 *
 * Typically used to indicate that different formats or representations
 * of the requested resource exist, such as varying file types.
 *
 * Value: 300
 */
const MULTIPLE_CHOICES = 300;

/**
 * Represents the HTTP status code for a resource that has been permanently moved to a new location.
 *
 * Value: 301
 *
 * This status code is typically used in HTTP redirection responses to indicate that the requested resource
 * has been assigned a new permanent URI, and any future references should use the new URI.
 *
 * Developers can use this constant when implementing or handling HTTP redirection logic. It is a conventional
 * way to signify the "301 Moved Permanently" HTTP status code instead of using the raw numeric value directly.
 */
const MOVED_PERMANENTLY = 301;

/**
 * A constant representing the HTTP status code for "Found".
 * Typically used in scenarios where a resource is temporarily
 * redirected to another URL.
 *
 * Value: 302
 */
const FOUND = 302;

/**
 * A constant representing the HTTP status code 303 (See Other).
 *
 * This status code indicates that the server is redirecting the client
 * to a different resource, typically using the `GET` method, even if
 * the original request was made using a different method (e.g., `POST`).
 *
 * This is commonly used to redirect after a form submission to a different
 * resource, preventing the form from being resubmitted upon page refresh.
 *
 * Value: 303
 */
const SEE_OTHER = 303;

/**
 * Represents the HTTP status code 304, which indicates that the resource has not been modified since the version specified by the request headers.
 * This status code is commonly used in conjunction with caching mechanisms to optimize network performance by allowing the client to use a locally cached copy of the resource.
 * It signifies that there is no need to retransmit the requested resource.
 */
const NOT_MODIFIED = 304;

/**
 * A constant representing the status code for the "Use Proxy" HTTP response.
 * This status code indicates that the requested resource must be accessed through the proxy specified in the response.
 * The server providing the proxy URL should be consulted for further details when this status code is returned.
 * This is typically used in scenarios where a proxy server is required to handle client requests.
 */
const USE_PROXY = 305;

/**
 * Represents the HTTP status code for a temporary redirect (307).
 *
 * A temporary redirect indicates that the requested resource resides temporarily under
 * a different URI. This status code is used to instruct the client to issue a new request
 * to the location provided by the response's "Location" header. Unlike a permanent redirect
 * (HTTP status code 301), subsequent requests for the resource should continue to use the
 * original URI.
 *
 * TEMPORARY_REDIRECT is typically used to handle temporary reorganizations, maintenance,
 * or content updates without altering bookmarks or links permanently. It ensures that
 * HTTP methods are preserved during the redirection process, meaning the method and body
 * of the original request will be reused in the redirected request.
 */
const TEMPORARY_REDIRECT = 307;

/**
 * Represents the HTTP status code for a permanent redirect.
 *
 * This status code indicates that the resource requested
 * has been permanently moved to a new URL. The client
 * should update bookmarks, and future requests should
 * be directed to the new URL provided in the response.
 *
 * Value: 308
 */
const PERMANENT_REDIRECT = 308;

/**
 * BAD_REQUEST is a constant representing the HTTP status code 400.
 * This status code indicates that the server cannot process the request
 * due to a client-side error, such as malformed syntax or invalid request parameters.
 */
const BAD_REQUEST = 400;

/**
 * Represents the HTTP status code for unauthorized client access.
 * This status code indicates that the request requires user authentication.
 * Commonly used in scenarios where authentication credentials are absent
 * or invalid, or the user does not have permission to access the requested resource.
 *
 * Value: 401
 */
const UNAUTHORIZED = 401;

/**
 * Represents the HTTP status code for "Payment Required".
 * Typically used to indicate that the client must provide payment or meet payment requirements
 * to access the requested resource.
 *
 * Value: 402
 */
const PAYMENT_REQUIRED = 402;

/**
 * A constant representing the HTTP status code for "Forbidden".
 * This status code indicates that the server understood the request but refuses to authorize it.
 * Commonly used to signify that access to the requested resource is not allowed.
 */
const FORBIDDEN = 403;

/**
 * Represents the HTTP status code for "Not Found".
 * Used to indicate that the requested resource could not be found on the server.
 * Commonly associated with HTTP status code 404.
 *
 * Example scenarios where this might be used:
 * - A user tries to access a webpage that does not exist.
 * - An API endpoint is called with an invalid resource identifier.
 *
 * Value: 404
 */
const NOT_FOUND = 404;

/**
 * Represents the HTTP status code for "Method Not Allowed".
 *
 * This status code indicates that the method specified in the
 * request is not allowed for the resource identified by the URI.
 *
 * Commonly used to signal that the request method is understood
 * by the server but is not supported or valid in the current context.
 *
 * Value: 405
 */
const METHOD_NOT_ALLOWED = 405;

/**
 * Represents the HTTP status code for "Not Acceptable".
 *
 * This status code indicates that the server cannot produce a response matching the list
 * of acceptable values defined in the request's proactive content negotiation headers,
 * and the server is unwilling to supply a default response.
 *
 * Commonly used in RESTful APIs to indicate that the server cannot serve any of the
 * representation(s) requested by the client.
 *
 * Value: 406
 */
const NOT_ACCEPTABLE = 406;

/**
 * The HTTP 407 Proxy Authentication Required status code indicates that the client must first authenticate itself with the proxy.
 * This status is sent along with a Proxy-Authenticate header, which provides information on how to authorize with the proxy.
 * It is commonly used in proxy server scenarios where authentication is required before accessing the requested resource.
 *
 * Value: 407
 */
const PROXY_AUTHENTICATION_REQUIRED = 407;

/**
 * REQUEST_TIMEOUT is a constant that represents the HTTP status code 408.
 * It indicates that the server timed out waiting for the client's request.
 *
 * This status code is commonly used to inform the client that their request
 * did not complete within the server's allotted time frame, prompting them
 * to retry or take corrective actions.
 */
const REQUEST_TIMEOUT = 408;

/**
 * Represents the HTTP status code for a conflict error.
 *
 * The `CONFLICT` variable is a numerical constant set to 409,
 * indicating that the request could not be processed because
 * of a conflict in the request state, such as an edit conflict
 * between multiple simultaneous updates.
 *
 * Commonly used in REST APIs to communicate conflict errors.
 *
 * Value: 409
 */
const CONFLICT = 409;

/**
 * Represents the HTTP status code 410, which indicates that the resource
 * requested is no longer available and will not be available again.
 * This status is typically used to inform the client that the resource
 * has been permanently removed and no forwarding address is provided.
 */
const GONE = 410;

/**
 * Represents an HTTP status code indicating that the server refuses to
 * accept the request without a defined Content-Length header. This status
 * code is typically returned when the server requires the client to specify
 * the size of the request payload before proceeding.
 *
 * @constant
 * @type {number}
 * @default 411
 */
const LENGTH_REQUIRED = 411;

/**
 * Represents the HTTP status code 412 (Precondition Failed).
 *
 * This status code indicates that one or more conditions given in the request header fields
 * were evaluated to be false when tested on the server.
 * The server uses this response to notify the client that the conditions specified in the
 * `If-Match`, `If-None-Match`, `If-Modified-Since`, `If-Unmodified-Since`, or `If-Range`
 * headers were not met.
 *
 * Commonly used in RESTful APIs to handle client expectations and preconditions.
 *
 * Value: 412
 */
const PRECONDITION_FAILED = 412;

/**
 * Constant representing the HTTP status code for "Payload Too Large".
 * This status code indicates that the server is refusing to process a request because
 * the request payload is larger than the server is willing or able to process.
 *
 * Typically used in API responses when the client request exceeds the allowable size limits.
 *
 * Value: 413
 */
const PAYLOAD_TOO_LARGE = 413;

/**
 * Represents the HTTP status code 414, which indicates that the URI requested by the client is too long for the server to process.
 * This status code may occur when a client sends a GET request with an excessively large query string or when headers exceed acceptable limits.
 * It is often used to signal clients to reduce the request size or consider alternative methods for data transfer.
 */
const URI_TOO_LONG = 414;

/**
 * Represents the HTTP status code for "Unsupported Media Type".
 * This status code indicates that the server refuses to process the request
 * because the request payload is in a format not supported by the server for the
 * targeted resource.
 *
 * Value: 415
 */
const UNSUPPORTED_MEDIA_TYPE = 415;

/**
 * Represents the HTTP status code for "Range Not Satisfiable".
 * This status code indicates that the server cannot return the requested portion(s) of the resource
 * due to either an invalid range specified in the "Range" header field or the resource's inability
 * to fulfill the requested range.
 *
 * Common reasons for this status:
 * - The range specified in the request does not overlap with the available content.
 * - The resource does not support range requests.
 *
 * The corresponding HTTP status code is: 416.
 */
const RANGE_NOT_SATISFIABLE = 416;

/**
 * Represents the HTTP status code 417 (Expectation Failed).
 * This status code indicates that the server cannot meet the requirements
 * of the Expect request-header field provided by the client.
 *
 * Commonly used in the context where the server is unable or unwilling to
 * process the "Expect" header sent by the client, leading to a failed request.
 *
 * Value: 417
 */
const EXPECTATION_FAILED = 417;

/**
 * Represents the HTTP status code 418, "I'm a teapot".
 * This status code is primarily used as an Easter egg in reference to the
 * Hyper Text Coffee Pot Control Protocol (HTCPCP), as defined in RFC 2324.
 * It is not an actual error status used in standard web applications.
 */
const IM_A_TEAPOT = 418;

/**
 * HTTP status code 421, representing "Misdirected Request".
 * This status code indicates that the request was directed at a server
 * that is not able to produce a response. This can happen, for example,
 * when the server being accessed does not support the functionality required
 * to fulfill the request, or if a request is incorrectly routed.
 *
 * Assigned value: 421
 */
const MISDIRECTED_REQUEST = 421;

/**
 * HTTP status code representing "Unprocessable Entity".
 * This status code indicates that the server understands the content type of the request entity, and the syntax of the request entity is correct, but it was unable to process the contained instructions.
 *
 * Commonly used in scenarios where validation errors occur or when the client sends a request that cannot be processed as-is by the server.
 *
 * Value: 422
 */
const UNPROCESSABLE_ENTITY = 422;

/**
 * Represents a constant or fixed value indicating a specific locked state or condition.
 * The value assigned to this variable is immutable and serves as a unique identifier
 * for the locked status within the application logic.
 *
 * @constant {number} LOCKED
 */
const LOCKED = 423;

/**
 * Represents the HTTP status code 424, indicating that the request failed
 * due to the failure of a previous request that the current request depends on.
 *
 * This status code is primarily used within the context of WebDAV, where
 * it signifies that a method could not be performed because it depends on
 * the success of another method that has failed.
 *
 * Commonly used to inform the client that the request cannot be fulfilled
 * due to unmet dependencies or prerequisites.
 */
const FAILED_DEPENDENCY = 424;

/**
 * A constant representing the HTTP status code 425, "Too Early".
 *
 * This status code indicates that the server is unwilling to risk
 * processing a request that might be replayed due to early execution.
 * Commonly used in scenarios involving cryptographic operations or
 * transactions that require precise timing to avoid replay attacks.
 */
const TOO_EARLY = 425;

/**
 * Status code indicating that an upgrade is required to access the resource.
 * Typically used in the context of HTTP, where the client must switch to
 * a different protocol or upgrade their connection to a supported version.
 *
 * - Value: 426
 * - Commonly associated with situations where the server demands protocol changes.
 */
const UPGRADE_REQUIRED = 426;

/**
 * The HTTP status code 428 Precondition Required.
 * This response indicates that the server requires the request to be conditional.
 * It is sent when a request is expected to be made using conditional headers, such as `If-Match` or `If-Unmodified-Since`.
 * This is typically used to prevent lost updates when multiple clients are concurrently modifying a resource.
 */
const PRECONDITION_REQUIRED = 428;

/**
 * Represents the HTTP status code for "Too Many Requests".
 *
 * This status code indicates that the user has sent too many requests
 * in a given amount of time ("rate limiting"). It is typically returned
 * by servers to signal that the server is temporarily unable to handle
 * further requests from the client due to exceeding a defined threshold.
 *
 * Common usage scenarios include API rate limiting or to prevent abuse
 * by limiting request frequencies.
 *
 * Value: 429
 */
const TOO_MANY_REQUESTS = 429;

/**
 * Represents the HTTP status code 431, "Request Header Fields Too Large".
 * This status code is returned when the server refuses to process a request
 * because the request's header fields are too large, either individually or collectively.
 * The client may wish to reduce the size of the header fields and retry the request.
 */
const REQUEST_HEADER_FIELDS_TOO_LARGE = 431;

/**
 * Represents the HTTP status code 451: Unavailable For Legal Reasons.
 * This status code indicates that the requested resource is unavailable
 * due to legal restrictions, such as censorship, court orders, or other
 * regulatory limitations imposed on the content.
 */
const UNAVAILABLE_FOR_LEGAL_REASONS = 451;

/**
 * A constant representing the HTTP status code 500 - Internal Server Error.
 * This status code indicates that the server encountered an unexpected condition
 * that prevented it from fulfilling the request.
 */
const INTERNAL_SERVER_ERROR = 500;

/**
 * A constant representing the HTTP status code 501, indicating that the server does not support
 * the functionality required to fulfill the request.
 * This status code is used when the server recognizes the request method, but it is not supported.
 * It signifies "Not Implemented" as defined in the HTTP/1.1 standard (RFC 7231).
 *
 * Value: 501
 */
const NOT_IMPLEMENTED = 501;

/**
 * BAD_GATEWAY is a numeric constant that represents the HTTP status code 502.
 * This status code indicates that the server, while acting as a gateway or proxy, received an invalid response from an upstream server.
 */
const BAD_GATEWAY = 502;

/**
 * Represents the HTTP status code for "Service Unavailable".
 * This status code indicates that the server is currently unable
 * to handle the request due to a temporary overload or scheduled
 * maintenance, implying that the condition is temporary and will
 * be alleviated after some time.
 *
 * Value: 503
 */
const SERVICE_UNAVAILABLE = 503;

/**
 * GATEWAY_TIMEOUT is a constant that represents the HTTP status code 504.
 * This status code indicates that a server acting as a gateway or proxy did not receive a timely response
 * from the upstream server or some other auxiliary server it needed to access in order to complete the request.
 */
const GATEWAY_TIMEOUT = 504;

/**
 * Represents the HTTP status code for "HTTP Version Not Supported".
 *
 * This status code indicates that the server does not support the HTTP protocol version
 * used in the request. The client may need to switch to a different version of HTTP or
 * resolve compatibility issues with the server.
 *
 * Value: 505
 *
 * Commonly used in HTTP responses to signal protocol version mismatches.
 */
const HTTP_VERSION_NOT_SUPPORTED = 505;

/**
 * The HTTP status code 506 represents "Variant Also Negotiates".
 * This error indicates that the server has an internal configuration error:
 * the chosen variant resource is configured to engage in content negotiation
 * itself and is therefore not a proper end point in the negotiation process.
 *
 * This code is typically used in the context of transparent content negotiation
 * when multiple variants are mistakenly configured to negotiate with the client,
 * creating a negotiation loop.
 *
 * Value: 506
 */
const VARIANT_ALSO_NEGOTIATES = 506;

/**
 * A constant representing the HTTP status code for "Insufficient Storage".
 *
 * This status code indicates that the server is unable to store the
 * representation needed to complete the request due to insufficient storage space.
 *
 * @constant {number}
 * @default 507
 */
const INSUFFICIENT_STORAGE = 507;

/**
 * The constant `LOOP_DETECTED` represents the HTTP status code 508,
 * indicating that the server detected an infinite loop while processing the request.
 *
 * This status code is primarily used in the context of Web Distributed Authoring
 * and Versioning (WebDAV) applications and signifies that the requested resource
 * was unable to be delivered due to a server configuration or logical error
 * involving recursive request processing.
 *
 * Value: 508
 */
const LOOP_DETECTED = 508;

/**
 * Represents the HTTP status code 510, indicating that the server requires further extensions
 * to fulfill the request. This status is typically used when the server is unable to process the
 * request due to missing extension(s) defined by a policy or configuration.
 *
 * Commonly associated with cases where the server has a policy that requires certain conditions
 * to be met, such as protocol extensions, before processing a request.
 */
const NOT_EXTENDED = 510;

/**
 * Represents the HTTP status code '511 Network Authentication Required'.
 * This status code indicates that the client needs to authenticate to
 * gain network access. It is typically used by intercepting proxies
 * that control access to the network.
 *
 * Value: 511
 */
const NETWORK_AUTHENTICATION_REQUIRED = 511;

/**
 * An immutable object representing standard HTTP status codes.
 *
 * Each property of the object corresponds to a specific HTTP status code,
 * as defined in the HTTP/1.1 standard and extensions.
 *
 * This object is frozen and cannot be modified after creation, ensuring that
 * the status codes remain consistent and unchangeable throughout the application lifecycle.
 *
 * Common usage includes identifying and handling HTTP response statuses
 * in web applications, APIs, and client-server communication protocols.
 */
const httpStatus = Object.freeze({
    CONTINUE,
    SWITCHING_PROTOCOLS,
    PROCESSING,
    EARLY_HINTS,
    OK,
    CREATED,
    ACCEPTED,
    NON_AUTHORITATIVE_INFORMATION,
    NO_CONTENT,
    RESET_CONTENT,
    PARTIAL_CONTENT,
    MULTI_STATUS,
    ALREADY_REPORTED,
    IM_USED,
    MULTIPLE_CHOICES,
    MOVED_PERMANENTLY,
    FOUND,
    SEE_OTHER,
    NOT_MODIFIED,
    USE_PROXY,
    TEMPORARY_REDIRECT,
    PERMANENT_REDIRECT,
    BAD_REQUEST,
    UNAUTHORIZED,
    PAYMENT_REQUIRED,
    FORBIDDEN,
    NOT_FOUND,
    METHOD_NOT_ALLOWED,
    NOT_ACCEPTABLE,
    PROXY_AUTHENTICATION_REQUIRED,
    REQUEST_TIMEOUT,
    CONFLICT,
    GONE,
    LENGTH_REQUIRED,
    PRECONDITION_FAILED,
    PAYLOAD_TOO_LARGE,
    URI_TOO_LONG,
    UNSUPPORTED_MEDIA_TYPE,
    RANGE_NOT_SATISFIABLE,
    EXPECTATION_FAILED,
    IM_A_TEAPOT,
    MISDIRECTED_REQUEST,
    UNPROCESSABLE_ENTITY,
    LOCKED,
    FAILED_DEPENDENCY,
    TOO_EARLY,
    UPGRADE_REQUIRED,
    PRECONDITION_REQUIRED,
    TOO_MANY_REQUESTS,
    REQUEST_HEADER_FIELDS_TOO_LARGE,
    UNAVAILABLE_FOR_LEGAL_REASONS,
    INTERNAL_SERVER_ERROR,
    NOT_IMPLEMENTED,
    BAD_GATEWAY,
    SERVICE_UNAVAILABLE,
    GATEWAY_TIMEOUT,
    HTTP_VERSION_NOT_SUPPORTED,
    VARIANT_ALSO_NEGOTIATES,
    INSUFFICIENT_STORAGE,
    LOOP_DETECTED,
    NOT_EXTENDED,
    NETWORK_AUTHENTICATION_REQUIRED,
});

export default httpStatus;
