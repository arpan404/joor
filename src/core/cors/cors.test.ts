import { JoorRequest } from '@/types/request';
import cors from '.';

describe('CORS', () => {
  it('should handle preflight requests with valid origin', async () => {
    const request = {
      method: 'OPTIONS',
      headers: { origin: 'https://example.com' },
    } as unknown as JoorRequest;
    const response = cors({
      origins: ['https://example.com'],
      methods: ['GET', 'POST'],
      allowedHeaders: ['Content-Type'],
      allowsCookies: true,
      maxAge: 3600,
    })(request);
    if (response) {
      const parsedResponse = response.parseResponse();
      expect(parsedResponse.status).toBe(204);
      expect(parsedResponse.headers).toEqual({
        'Access-Control-Allow-Origin': 'https://example.com',
        'Access-Control-Allow-Methods': 'GET,POST',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Max-Age': '3600',
      });
    }
  });

  it('should handle preflight requests with invalid origin', async () => {
    const request = {
      method: 'OPTIONS',
      headers: { origin: 'https://invalid.com' },
    } as unknown as JoorRequest;
    const response = cors({
      origins: ['https://example.com'],
    })(request);
    expect(response).toBeDefined();
    if (response) {
      const parsedResponse = response.parseResponse();
      expect(parsedResponse.status).toBe(204);
    }
  });

  it('should handle non-preflight requests', async () => {
    const request = {
      method: 'GET',
      headers: { origin: 'https://exampl.com' },
    } as unknown as JoorRequest;
    const response = cors({
      origins: ['https://example.com'],
    })(request);
    expect(response).toBeUndefined();
  });
});
