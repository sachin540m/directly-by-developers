import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { spawn } from 'child_process'
import path from 'path'
import fs from 'fs'

/**
 * Dev-server middleware to execute PHP backend locally when running `npm run dev`
 */
function phpDevServerPlugin() {
  return {
    name: 'php-dev-server-middleware',
    configureServer(server) {
      server.middlewares.use('/api/submit-lead.php', (req, res, next) => {
        if (req.method !== 'POST') return next();

        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
          const phpBin = fs.existsSync('C:\\xampp\\php\\php.exe') ? 'C:\\xampp\\php\\php.exe' : 'php';
          const scriptPath = path.resolve(__dirname, 'api/submit-lead.php');

          const phpProcess = spawn(phpBin, [scriptPath], {
            env: {
              ...process.env,
              REQUEST_METHOD: 'POST',
              CONTENT_TYPE: 'application/json',
              CONTENT_LENGTH: Buffer.byteLength(body).toString(),
              REMOTE_ADDR: '127.0.0.1',
              HTTP_ORIGIN: req.headers.origin || 'http://localhost:5173',
              SERVER_NAME: 'localhost'
            }
          });

          let stdout = '';
          let stderr = '';
          phpProcess.stdout.on('data', data => { stdout += data; });
          phpProcess.stderr.on('data', data => { stderr += data; });
          phpProcess.stdin.write(body);
          phpProcess.stdin.end();

          phpProcess.on('close', code => {
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
            res.setHeader('Access-Control-Allow-Credentials', 'true');

            // Find JSON in output
            const jsonStart = stdout.indexOf('{');
            const cleanBody = jsonStart !== -1 ? stdout.slice(jsonStart) : stdout;

            if (code === 0 && cleanBody) {
              res.statusCode = 200;
              res.end(cleanBody);
            } else {
              res.statusCode = 500;
              res.end(JSON.stringify({
                success: false,
                message: stderr || 'Local PHP execution failed.'
              }));
            }
          });
        });
      });
    }
  };
}

/**
 * Plugin to automatically copy the `api` directory to `dist/api` on production build
 */
function copyApiPlugin() {
  return {
    name: 'copy-api-to-dist',
    closeBundle() {
      const srcDir = path.resolve(__dirname, 'api');
      const destDir = path.resolve(__dirname, 'dist/api');
      if (fs.existsSync(srcDir)) {
        fs.cpSync(srcDir, destDir, { recursive: true });
        console.log('✅ Successfully copied api/ directory to dist/api');
      }
    }
  };
}

export default defineConfig({
  plugins: [react(), phpDevServerPlugin(), copyApiPlugin()],
  // Use relative paths so the built site works in any subdirectory
  // (e.g. /directly/ on XAMPP, or the root on Hostinger)
  base: './',
})
