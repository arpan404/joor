type ERROR = {
  code?: string;
  message?: string;
  details?: string;
  timeStamp?: Date;
};

type RESPONSE = {
  status?: number;
  message?: string;
  data?: any;
  error?: string | ERROR;
  cookies?: { [key: string]: string };
  headers?: { [key: string]: string };
  session?: string;
};

export { RESPONSE, ERROR };
