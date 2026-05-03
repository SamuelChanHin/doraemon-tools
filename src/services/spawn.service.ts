import { spawn } from 'child_process';

export class SpawnService {
  static runPyPromise = (path: string, argv: string[]): Promise<any> => {
    return new Promise((res, rej) => {
      const pyprog = spawn('python', [path, ...argv]);
      pyprog.stdout.on('data', function (data) {
        res(data);
      });
      pyprog.stderr.on('data', (data) => {
        rej(data);
      });
    });
  };
}
