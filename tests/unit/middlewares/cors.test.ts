// import cors from '@/middlewares/cors';
// import { JoorRequest } from '@/types/request';
// describe('CORS', () => {
//   it("should handle request with default options if 'options' is not provided", async () => {
//     const request = {
//       method: 'OPTIONS',
//       headers: { origin: 'https://example.com' },
//     } as unknown as JoorRequest;

//     const response = cors()(request);
//     expect(response).toBeDefined();
//     if (response) {
//       const parsedResponse = response.parseResponse();
//       expect(parsedResponse.status).toBe(204);
//       expect(parsedResponse.headers).toEqual({
//         'Access-Control-Allow-Origin': '*',
//         'Access-Control-Allow-Methods': '*',
//         'Access-Control-Allow-Headers': '*',
//         'Access-Control-Allow-Credentials': 'false',
//         'Access-Control-Max-Age': '0',
//       });
//     }
//   });
//   it('should handle preflight requests with valid origin', async () => {
//     const request = {
//       method: 'OPTIONS',
//       headers: { origin: 'https://example.com' },
//     } as unknown as JoorRequest;

//     const response = cors({
//       origins: ['https://example.com'],
//       methods: ['GET', 'POST'],
//       allowedHeaders: ['Content-Type'],
//       allowsCookies: true,
//       maxAge: 3600,
//     })(request);

//     if (response) {
//       const parsedResponse = response.parseResponse();
//       expect(parsedResponse.status).toBe(204);
//       expect(parsedResponse.headers).toEqual({
//         'Access-Control-Allow-Origin': 'https://example.com',
//         'Access-Control-Allow-Methods': 'GET,POST',
//         'Access-Control-Allow-Headers': 'Content-Type',
//         'Access-Control-Allow-Credentials': 'true',
//         'Access-Control-Max-Age': '3600',
//       });
//     }
//   });
//   it('should handle preflight requests with invalid origin', async () => {
//     const request = {
//       method: 'OPTIONS',
//       headers: { origin: 'https://invalid.com' },
//     } as unknown as JoorRequest;

//     const response = cors({
//       origins: ['https://example.com'],
//     })(request);
//     expect(response).toBeDefined();
//     if (response) {
//       const parsedResponse = response.parseResponse();
//       expect(parsedResponse.status).toBe(204);
//     }
//   });
//   it('should handle non-preflight requests', async () => {
//     const request = {
//       method: 'GET',
//       headers: { origin: 'https://exampl.com' },
//     } as unknown as JoorRequest;

//     const response = cors({
//       origins: ['https://example.com'],
//     })(request);
//     expect(response).toBeUndefined();
//   });
//   it('should handle wildcard origin', async () => {
//     const request = {
//       method: 'OPTIONS',
//       headers: { origin: 'https://any-domain.com' },
//     } as unknown as JoorRequest;

//     const response = cors({
//       origins: ['*'],
//       methods: ['GET'],
//     })(request);

//     if (response) {
//       const parsedResponse = response.parseResponse();
//       expect(parsedResponse.headers).toBeDefined();
//       if (parsedResponse.headers) {
//         expect(parsedResponse.headers['Access-Control-Allow-Origin']).toBe('*');
//       }
//     }
//   });
//   it('should handle multiple allowed origins', async () => {
//     const request = {
//       method: 'OPTIONS',
//       headers: { origin: 'https://site2.com' },
//     } as unknown as JoorRequest;

//     const response = cors({
//       origins: ['https://site1.com', 'https://site2.com'],
//       methods: ['GET'],
//     })(request);

//     if (response) {
//       const parsedResponse = response.parseResponse();
//       expect(parsedResponse.headers).toBeDefined();
//       if (parsedResponse.headers) {
//         expect(parsedResponse.headers['Access-Control-Allow-Origin']).toBe(
//           'https://site2.com'
//         );
//       }
//     }
//   });
//   it('should handle custom exposed headers', async () => {
//     const request = {
//       method: 'OPTIONS',
//       headers: { origin: 'https://example.com' },
//     } as unknown as JoorRequest;

//     const response = cors({
//       origins: ['https://example.com'],
//       exposedHeaders: ['X-Custom-Header'],
//     })(request);

//     if (response) {
//       const parsedResponse = response.parseResponse();
//       expect(parsedResponse.headers).toBeDefined();
//       if (parsedResponse.headers) {
//         expect(parsedResponse.headers['Access-Control-Expose-Headers']).toBe(
//           'X-Custom-Header'
//         );
//       }
//     }
//   });
//   it('should handle request without origin header', async () => {
//     const request = {
//       method: 'OPTIONS',
//       headers: {},
//     } as unknown as JoorRequest;

//     const response = cors({
//       origins: ['https://example.com'],
//     })(request);
//     expect(response).toBeDefined();
//   });
//   it('should handle request without origin header for other requests than GET', async () => {
//     const request = {
//       method: 'GET',
//       headers: {},
//     } as unknown as JoorRequest;

//     const response = cors({
//       origins: ['https://example.com'],
//     })(request);
//     expect(response).toBeUndefined();
//   });
//   it('should handle case-sensitive headers', async () => {
//     const request = {
//       method: 'OPTIONS',
//       headers: {
//         origin: 'https://example.com',
//         'Content-Type': 'application/json',
//       },
//     } as unknown as JoorRequest;

//     const response = cors({
//       origins: ['https://example.com'],
//       allowedHeaders: ['content-type'],
//     })(request);

//     if (response) {
//       const parsedResponse = response.parseResponse();
//       expect(parsedResponse.headers).toBeDefined();
//       if (parsedResponse.headers) {
//         expect(parsedResponse.headers['Access-Control-Allow-Headers']).toBe(
//           'content-type'
//         );
//       }
//     }
//   });
//   it('should handle complex preflight requests with multiple headers', async () => {
//     const request = {
//       method: 'OPTIONS',
//       headers: {
//         origin: 'https://example.com',
//         'access-control-request-headers':
//           'content-type,authorization,x-requested-with',
//         'access-control-request-method': 'POST',
//       },
//     } as unknown as JoorRequest;

//     const response = cors({
//       origins: ['https://example.com'],
//       methods: ['GET', 'POST', 'PUT', 'DELETE'],
//       allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
//       allowsCookies: true,
//     })(request);

//     if (response) {
//       const parsedResponse = response.parseResponse();
//       expect(parsedResponse.headers).toMatchObject({
//         'Access-Control-Allow-Headers':
//           'Content-Type,Authorization,X-Requested-With',
//         'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE',
//         'Access-Control-Allow-Credentials': 'true',
//       });
//     }
//   });
//   it('should handle requests from subdomains', async () => {
//     const request = {
//       method: 'OPTIONS',
//       headers: { origin: 'https://sub.example.com' },
//     } as unknown as JoorRequest;

//     const response = cors({
//       origins: ['https://*.example.com'],
//       methods: ['GET'],
//     })(request);

//     if (response) {
//       const parsedResponse = response.parseResponse();
//       expect(parsedResponse.headers?.['Access-Control-Allow-Origin']).toBe(
//         'https://sub.example.com'
//       );
//     }
//   });
//   it('should handle GET requests from subdomains', async () => {
//     const request = {
//       method: 'GET',
//       headers: { origin: 'https://sub.example.com' },
//     } as unknown as JoorRequest;

//     const response = cors({
//       origins: ['https://*.example.com'],
//       methods: ['POST'],
//     })(request);

//     if (response) {
//       const parsedResponse = response.parseResponse();
//       console.log(parsedResponse);
//       expect(parsedResponse.headers?.['Access-Control-Allow-Origin']).toBe(
//         'https://sub.example.com'
//       );
//     } else {
//       expect(request.joorHeaders).toBeDefined();
//       expect(request.joorHeaders!['Access-Control-Allow-Origin']).toBe(
//         'https://sub.example.com'
//       );
//     }
//   });
//   it('should handle requests with varying protocols (http/https)', async () => {
//     const request = {
//       method: 'OPTIONS',
//       headers: { origin: 'http://example.com' },
//     } as unknown as JoorRequest;

//     const response = cors({
//       origins: ['https://example.com', 'http://example.com'],
//       methods: ['GET'],
//     })(request);

//     if (response) {
//       const parsedResponse = response.parseResponse();
//       expect(parsedResponse.headers?.['Access-Control-Allow-Origin']).toBe(
//         'http://example.com'
//       );
//     }
//   });
//   it('should handle requests with varying ports when cors is configured with wilcard port address', async () => {
//     const request = {
//       method: 'OPTIONS',
//       headers: { origin: 'https://example.com:3000' },
//     } as unknown as JoorRequest;

//     const response = cors({
//       origins: ['https://example.com:*'],
//       methods: ['GET'],
//     })(request);

//     if (response) {
//       const parsedResponse = response.parseResponse();
//       expect(parsedResponse.headers?.['Access-Control-Allow-Origin']).toBe(
//         'https://example.com:3000'
//       );
//     }
//   });
//   it('should handle requests with port numbers', async () => {
//     const request = {
//       method: 'OPTIONS',
//       headers: { origin: 'https://localhost:3000' },
//     } as unknown as JoorRequest;

//     const response = cors({
//       origins: ['https://localhost:3000'],
//       methods: ['GET'],
//     })(request);

//     if (response) {
//       const parsedResponse = response.parseResponse();
//       expect(parsedResponse.headers?.['Access-Control-Allow-Origin']).toBe(
//         'https://localhost:3000'
//       );
//     }
//   });
//   it('should handle development environment with multiple local origins', async () => {
//     const request = {
//       method: 'OPTIONS',
//       headers: { origin: 'http://localhost:3000' },
//     } as unknown as JoorRequest;

//     const response = cors({
//       origins: [
//         'http://localhost:3000',
//         'http://localhost:8080',
//         'http://127.0.0.1:3000',
//       ],
//       methods: ['GET', 'POST', 'PUT', 'DELETE'],
//       allowedHeaders: ['*'],
//       allowsCookies: true,
//     })(request);

//     if (response) {
//       const parsedResponse = response.parseResponse();
//       expect(parsedResponse.headers?.['Access-Control-Allow-Origin']).toBe(
//         'http://localhost:3000'
//       );
//     }
//   });
// });

describe('first', () => { it('should be true', () => { expect(1 + 1).toBe(2); }); });
