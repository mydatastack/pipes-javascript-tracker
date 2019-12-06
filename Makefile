live-reload:
	@npx live-server

tracking-endpoint:
	@node ./test/server.js

bundle:
	@npx watchify main.js -o bundle.js
