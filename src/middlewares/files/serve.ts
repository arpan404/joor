import JoorResponse from '@/core/response';

export default function serveFile({
  filePath,
  stream = true,
  download = false,
}: {
  filePath: string;
  stream?: boolean;
  download?: boolean;
}): JoorResponse {
  const response = new JoorResponse();
  response.sendAsFile(filePath);
  if (stream) {
    response.sendAsStream();
  }

  if (download) {
    response.sendAsDownload();
  }

  return response;
}
