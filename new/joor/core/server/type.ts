type PREPARED_RESPONSE = {
  headers: {
    [key: string]: string;
  };
  status: number;
  data: unknown;
};

export { PREPARED_RESPONSE };
