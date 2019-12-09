live-reload:
	@npx live-server

tracking-endpoint:
	@node ./test/server.js

bundle:
	@npx watchify pipes.js -o pipes.min.js

package:
	@echo Packaging tag.js
	@npx browserify tag.js -o ./build/tag.js
	@echo Packaging pipes.js
	@npx browserify pipes.js -o ./build/pipes.min.js
