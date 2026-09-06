import { defineConfig } from 'astro/config';
import { resolve, relative, sep } from 'node:path';

export default defineConfig({
  site: 'https://zifeiyu-qc.github.io',
  output: 'static',
  vite: {
    plugins: [{
      name: 'learning-content-reload',
      configureServer(server) {
        const root = resolve('public/learning');
        server.watcher.add(root);
        const reload = (file) => {
          const parts = relative(root, resolve(file)).split(sep);
          if (parts.length === 3 && parts[0] !== '..' && parts[2] === 'content.json') {
            server.ws.send({ type: 'full-reload', path: '*' });
          }
        };
        server.watcher.on('add', reload).on('change', reload).on('unlink', reload);
        server.httpServer?.once('close', () => {
          for (const event of ['add', 'change', 'unlink']) server.watcher.off(event, reload);
        });
      },
    }],
  },
});
