# commands for js-tracker
s3_region := 'eu-central-1'
s3_bucket := 'pipesdata.com-js-trackers'
s3_folder := '16vzxu7np2'

live-reload:
	@npx live-server

tracking-endpoint:
	@node ./js-tracker/src/test/server.js

bundle-main:
	@npx watchify ./js-tracker/src/pipes.js -o ./build/pipes.min.js

bundle-tag:
	@npx watchify ./tag.js -o ./build/tag.min.js 


package:
	@echo Packaging tag.js
	@npx browserify ./src/tag.js -o ./build/tag.min.js
	@echo Packaging pipes.js
	@npx browserify ./src/pipes.js -o ./build/pipes.min.js

upload:
	@aws s3 sync ./build/ s3://$(s3_bucket)/$(s3_folder)/ 

# commands for the deployer
ARTIFACTS_BUCKET := tarasowski-dev-js-tracker-cfn-artifacts
STACKNAME := trs-local-tracker

validate:
	@aws cloudformation validate-template --template-body file://deployer/infrastructure/app/template.yaml

create_bucket:
	@aws s3api create-bucket --bucket $(ARTIFACTS_BUCKET) --region eu-central-1 --create-bucket-configuration LocationConstraint=eu-central-1

deploy: validate
	@aws cloudformation package --template-file ./deployer/infrastructure/app/template.yaml --output-template-file ./deployer/infrastructure/app/output.yaml --s3-bucket $(ARTIFACTS_BUCKET) --region eu-central-1
	@aws cloudformation deploy --template-file ./deployer/infrastructure/app/output.yaml --stack-name $(STACKNAME) --capabilities CAPABILITY_NAMED_IAM CAPABILITY_AUTO_EXPAND --region eu-central-1
