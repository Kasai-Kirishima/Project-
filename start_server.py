#!/usr/bin/env python3
"""Мини-сервер для локального запуска офлайн-игры «Одержимые»."""
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
import os

ROOT = Path(__file__).resolve().parent
PORT = 8000

class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

if __name__ == '__main__':
    os.chdir(ROOT)
    server = ThreadingHTTPServer(('0.0.0.0', PORT), Handler)
    print(f'Одержимые запущены: http://127.0.0.1:{PORT}')
    print('Откройте этот адрес в браузере. Для телефона в одной Wi-Fi-сети используйте IP ноутбука.')
    print('Остановить сервер: Ctrl+C')
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print('\nСервер остановлен.')
        server.server_close()
