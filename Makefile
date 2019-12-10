# tracking endpoint
api_region := 'eu-central-1'
apiId := '16vzxu7np2'
path := 'dev'
key := ''

# s3 bucket
s3_region := 'eu-central-1'
s3_bucket := 'pipesdata.com-js-trackers'
s3_folder := '16vzxu7np2'

live-reload:
	@npx live-server

tracking-endpoint:
	@node ./test/server.js

bundle-main:
	@npx watchify pipes.js -o ./build/pipes.min.js

bundle-tag:
	@npx watchify tag.js -o ./build/tag.min.js 


package:
	@echo Packaging tag.js
	@npx browserify ./src/tag.js -o ./build/tag.min.js
	@echo Packaging pipes.js
	@npx browserify ./src/pipes.js -o ./build/pipes.min.js

upload:
	@aws s3 sync ./build/ s3://$(s3_bucket)/$(s3_folder)/ 
