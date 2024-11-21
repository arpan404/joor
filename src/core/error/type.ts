type JOOR_ERROR = {
  errorCode: string;
  message: string;
  type: "warn" | "error" | "panic";
};

export { JOOR_ERROR };
