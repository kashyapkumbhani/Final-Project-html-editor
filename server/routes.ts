import type { Express } from "express";
import { createServer, type Server } from "http";
import { render } from "../client/src/entry-server";

export function registerRoutes(app: Express): Server {
  // API routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // SSR handling for homepage only
  app.get('/', async (req, res, next) => {
    try {
      // Add proper caching headers for SSR content
      res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=30');
      
      const html = render(req.originalUrl);
      res.status(200)
        .setHeader('Content-Type', 'text/html; charset=utf-8')
        .setHeader('X-Content-Type-Options', 'nosniff')
        .end(html);
    } catch (error) {
      console.error('SSR Error:', error);
      
      // Enhanced fallback with proper meta tags and minimal styling
      res.status(200)
        .setHeader('Content-Type', 'text/html; charset=utf-8')
        .send(`
          <!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <meta name="description" content="Visual HTML Editor - Modern Web Development Tool" />
              <title>Visual HTML Editor</title>
              <style>
                body { margin: 0; font-family: system-ui, -apple-system, sans-serif; }
                #root { min-height: 100vh; }
              </style>
            </head>
            <body>
              <div id="root"></div>
              <script type="module" src="/src/entry-client.tsx"></script>
            </body>
          </html>
        `);
    }
  });

  // Editor route - Always client-side rendered
  app.get('/editor', (_req, res) => {
    res.status(200).send(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Visual HTML Editor - Editor</title>
        </head>
        <body>
          <div id="root"></div>
          <script type="module" src="/src/entry-client.tsx"></script>
        </body>
      </html>
    `);
  });

  // Create and return the HTTP server
  const httpServer = createServer(app);
  return httpServer;
}
