import JoorResponse from '@/core/response';

export default async function redirect(
  path: string,
  permanent: true
): Promise<JoorResponse> {
  const response = new JoorResponse();
  response.setStatus(permanent ? 301 : 302);
  response.setHeader({ Location: path });

  return response;
}
