from pyppeteer import launch

from pathlib import Path

from threading import Thread

import http.server
import socketserver

import os
import time

HOST = 'localhost'
PORT = 3333

class ThreadedTCPServer(socketserver.ThreadingMixIn, socketserver.TCPServer):
    """Handle requests in a separate thread."""
    daemon_threads = True  # Ensure that the entire Python program exits when the main process exits
    allow_reuse_address = True  # Allows the server to bind to the port even if it was used recently

def get_server(base_path: Path, port: int):
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
    
    def __init__(self):
        self.results = {}

    async def start(self):
        self.httpd = get_server(Path(__file__).parent / 'benchmark.html', PORT)

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
        self.browser = await launch({ "headless": True })
        self.page = await self.browser.newPage()
        await self.page.goto(f"http://{HOST}:{PORT}")

    async def run_all(self, tests=[]):
        for test in tests:
            await self.run(test)

    async def run(self, test):
        start = time.time()
        browser_ms = await self.page.evaluate(f'globalThis.runBenchmark("{test}")')
        end = time.time()
        python_ms = (end - start) * 1000

        print(f"Browser: {browser_ms}ms")
        print(f"Python: {python_ms}ms")

        self.results[test] = {
            "browser": browser_ms,
            "python": python_ms
        }

    async def close(self):
        if self.browser:
            await self.browser.close()

        if self.httpd:
            self.httpd.shutdown()
            self.server_thread.join()


