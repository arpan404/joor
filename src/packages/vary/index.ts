import Jrror from '@/core/error';
import Response from '@/types/response';

const FIEL_NAME_REGEX = /^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/;

const parse = (field: string) => {
  if (!field) return [];

  const list = [];
  let start = 0,
    end = 0;
  const len = field.length;

  for (let i = 0; i < len; i++) {
    const code = field.charCodeAt(i);

    if (code === 0x2c) {
      list.push(field.substring(start, end));
      start = end = i + 1;
    } else if (code === 0x20 && start === end) {
      start = end = i + 1;
    } else {
      end = i + 1;
    }
  }
  // Push the final token.
  list.push(field.substring(start, end));
  return list;
};

const append = (header: string, field: unknown): string => {
  if (typeof header !== 'string') {
    throw new Jrror({
      code: 'vary-header-invalid',
      message: `Header must be a string, but ${typeof header} was provided.`,
      type: 'error',
      docsPath: '/response#vary',
    });
  }

  if (!field) {
    throw new Jrror({
      code: 'vary-field-invalid',
      message: `Field cannot be null or undefined.`,
      type: 'error',
      docsPath: '/response#vary',
    });
  }

  const fields = Array.isArray(field) ? field : parse(String(field));

  for (let i = 0; i < fields.length; i++) {
    if (!FIEL_NAME_REGEX.test(fields[i])) {
      throw new Jrror({
        code: 'vary-field-invalid',
        message: `Field name "${fields[i]}" contains invalid characters.`,
        type: 'error',
        docsPath: '/response#vary',
      });
    }
  }

  if (header === '*') {
    return header;
  }

  let val = header;
  const vals = parse(header.toLowerCase());

  if (fields.indexOf('*') !== -1 || vals.indexOf('*') !== -1) {
    return '*';
  }

  for (let i = 0; i < fields.length; i++) {
    const lowerField = fields[i].toLowerCase();

    if (vals.indexOf(lowerField) === -1) {
      vals.push(lowerField);
      val = val ? `${val}, ${fields[i]}` : fields[i];
    }
  }

  return val;
};

const vary = (res: Response, field: unknown): void => {
  if (!res) {
    throw new Jrror({
      code: 'vary-response-invalid',
      message: `Response object passed to vary cannot be null or undefined.`,
      type: 'error',
      docsPath: '/response#vary',
    });
  }
  let varyHeaderValue = res.getHeader('Vary') ?? ' ';
  const header = Array.isArray(varyHeaderValue)
    ? varyHeaderValue.join(',')
    : String(varyHeaderValue);

  varyHeaderValue = append(header, field);
  if (varyHeaderValue) {
    res.setHeader('Vary', varyHeaderValue);
  }
};

export default vary;
