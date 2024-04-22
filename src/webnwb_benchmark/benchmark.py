from pyppeteer import launch

from pathlib import Path

from threading import Thread

import http.server
import socketserver

import os
import time

HOST = "localhost"
PORT = 3333


class ThreadedTCPServer(socketserver.ThreadingMixIn, socketserver.TCPServer):
    """Handle requests in a separate thread."""

    # Ensure that the entire Python program exits when the main process exits
    daemon_threads = True
    
    # Allows the server to bind to the port even if it was used recently
    allow_reuse_address = True


def get_server(base_path: Path, port: int):
    cwd = os.getcwd()

    class MyHttpRequestHandler(http.server.SimpleHTTPRequestHandler):
        def do_GET(self):
            if self.path == "/":
                self.path = str(base_path.relative_to(cwd))
            else:
                full_path = base_path.parent / self.path[1:]
                self.path = str(full_path.relative_to(cwd))
                print(f"GET {self.path}")
            return super().do_GET()

    return ThreadedTCPServer(("", port), MyHttpRequestHandler)


class WebNWBBenchmarks:

    def __init__(self, html_path: Path):
        self.html_path = html_path
        self.httpd = None
        self.server_thread = None
        self.browser = None
        self.page = None
        self.results = {}

    async def start(self):
        print(f"Starting server at http://{HOST}:{PORT}")
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
        print(f"Opening Puppeteer browser at http://{HOST}:{PORT}")
        self.browser = await launch({"headless": True})
        self.page = await self.browser.newPage()
        await self.page.goto(f"http://{HOST}:{PORT}")

    async def run_all(self, tests=[]):
        for test in tests:
            await self.run(test)

    async def run(self, test):
        print(f"Running {test}")
        test_results = await self.page.evaluate(f'globalThis.runBenchmark("{test}")')
        print(f"\t— {test_results}\n")

        self.results[test] = test_results

    async def close(self):

        if self.browser:
            await self.browser.close()

        if self.httpd:
            self.httpd.shutdown()
            self.server_thread.join()
