/**
 * @example
 * ```json
 * {
 * port: 8800,
 * parseJSON: true,
 * cors: true,
 * urlEncoded: true,
 * allowedURL: ["http://localhost/", "https://example.com/"],
 * mode: "development",
 * doLogs: true,
 * allowsFileUpload: true
 * }
 */
type JOOR_CONFIG = {
  port: number;
  parseJSON?: boolean;
  cors?: boolean;
  urlEncoded?: boolean;
  allowedURL?: Array<string>;
  mode: "development" | "production" | "testing";
  doLogs?: boolean;
  allowsFileUpload?: boolean;
};

export default JOOR_CONFIG;
