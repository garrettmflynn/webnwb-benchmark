from pyppeteer import launch
from pathlib import Path
from threading import Thread
import http.server
import socketserver
import os


HOST = 'localhost'
PORT = 3333

class ThreadedTCPServer(socketserver.ThreadingMixIn, socketserver.TCPServer):
    """Handle requests in a separate thread."""
    daemon_threads = True  # Ensure that the entire Python program exits when the main process exits
    allow_reuse_address = True  # Allows the server to bind to the port even if it was used recently

def get_server(base_path: Path, port: int):
    """Create a simple HTTP server that serves files from the given directory."""
    cwd = os.getcwd()

    class MyHttpRequestHandler(http.server.SimpleHTTPRequestHandler):
        def do_GET(self):
            if self.path == '/':
                self.path = str(base_path.relative_to(cwd))
            else:
                self.path = str((base_path.parent / self.path[1:]).relative_to(cwd))
            return super().do_GET()

    return ThreadedTCPServer(("", port), MyHttpRequestHandler)

class WebNWBBenchmarks:
    
    def __init__(self, html_path: Path):
        """Initialize the instance properties"""
        self.html_path = html_path
        self.httpd = None
        self.server_thread = None
        self.browser = None
        self.page = None
        self.results = {}

    async def start(self):
        """Start the basic HTTP server at the given path and port."""
        self.httpd = get_server(self.html_path, PORT)

        def start_server():
            try:
                self.httpd.serve_forever()
            except KeyboardInterrupt:
                pass
            finally:
                self.httpd.server_close()
        
        self.server_thread = Thread(target=start_server)
        self.server_thread.start()

    async def open(self):
        """Open a new browser using Puppeteer and navigate to the server URL."""

        if not self.httpd:
            await self.start() # Start the server if it's not already started

        self.browser = await launch({ "headless": True })
        self.page = await self.browser.newPage()
        await self.page.goto(f"http://{HOST}:{PORT}")

    async def run_all(self, tests=[]):
        """Run all the tests in the given list."""
        for test in tests:
            await self.run(test)

    async def run(self, test):
        """Trigger a benchmark test via the Puppeteer instance and receive the results back."""
        if not self.page:
            await self.open() # Open the browser if it's not already open

        browser_ms = await self.page.evaluate(f'globalThis.runBenchmark("{test}")')
        self.results[test] = browser_ms

    async def close(self):
        """Close the browser and the HTTP server."""
        if self.browser:
            await self.browser.close()
            del self.browser

        if self.httpd:
            self.httpd.shutdown()
            self.server_thread.join()
            del self.httpd
            del self.server_thread
            


