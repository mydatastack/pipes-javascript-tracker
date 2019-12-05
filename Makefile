develop:
	@npx live-server

server:
	@node ./test/server.js

bundle:
	@npx watchify main.js -o bundle.js
