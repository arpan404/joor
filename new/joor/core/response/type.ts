type RESPONSE_ERROR = {
  code?: string;
  message?: string;
  data?: unknown;
  timeStamp?: Date;
};

type RESPONSE = {
  status?: number;
  message?: string;
  data?: unknown;
  error?: string | RESPONSE_ERROR;
  cookies?: { [key: string]: string };
  headers?: { [key: string]: string };
};

export { RESPONSE };
