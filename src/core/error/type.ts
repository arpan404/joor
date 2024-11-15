type JOOR_ERROR = {
  errorCode: string;
  message: string;
  type: "warn" | "error" | "panic";
};

type JOOR_ERROR_LIST = {
  [errorCode: JOOR_ERROR["errorCode"]]: Pick<JOOR_ERROR, "message" | "type">;
};

export { JOOR_ERROR, JOOR_ERROR_LIST };
