develop:
	@npx live-server

server:
	@echo Starting local server under http://localhost:8888
	@node ./test/server.js