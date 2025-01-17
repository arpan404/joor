type PREPARED_RESPONSE = {
  headers: {
    [key: string]: string;
  };
  status: number;
  data: unknown;
  cookies: Array<string>;
};

export { PREPARED_RESPONSE };
