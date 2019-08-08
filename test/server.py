import socket
import json

HOST = 'localhost'   # use '' to expose to all networks
PORT = 8888 

def incoming(host, port):
    """Open specified port and yield requests"""
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
   # sock.settimeout(10000000)
    sock.bind((host, port))
    sock.listen(0)
    try:
        while True:
            request, addr = sock.accept()
            yield request
            request.close()
    except socket.timeout:
        raise StopIteration
    finally:
        sock.close()

for request in incoming(HOST, PORT):
    print(json.dumps(request.recv(1024).decode('utf-8'), indent=4))
