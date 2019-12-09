live-reload:
	@npx live-server

tracking-endpoint:
	@node ./test/server.js

bundle:
	@npx watchify pipes.js -o pipes.min.js
