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
