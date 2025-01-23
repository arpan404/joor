interface JOOR_ERROR {
  code: string;
  message: string;
  type: 'warn' | 'error' | 'panic';
}

export { JOOR_ERROR };
