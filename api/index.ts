import 'tsconfig-paths/register';
import type { IncomingMessage, ServerResponse } from 'http';
import { createNestApp } from '../src/bootstrap';

let appPromise: ReturnType<typeof createNestApp> | undefined;

async function getApp() {
  if (!appPromise) {
    appPromise = createNestApp();
  }

  return appPromise;
}

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse,
) {
  const app = await getApp();
  const server = app.getHttpAdapter().getInstance();

  return server(req, res);
}