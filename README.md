This project is a simple Express.js application that serves static files. The CORS settings provided allow requests from any origin for JSON files, while requests for HTML files are restricted to `http://localhost:3000`.

The application includes several endpoints:

- The `GET /` returns a simple "Hi" message.
- The `GET /static/index.html` endpoint serves an HTML file with appropriate CORS headers.
- The `GET /static/data.json` endpoint serves a JSON file, also with CORS headers.
- If an invalid endpoint is accessed, like `GET /abc`, the application responds with a 404 error and a custom error page.
