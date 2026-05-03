import 'tsconfig-paths/register';
import { createNestApp } from './bootstrap';

async function bootstrap() {
  const app = await createNestApp();
  await app.listen(process.env.PORT || 8080, '0.0.0.0');
}
bootstrap();
