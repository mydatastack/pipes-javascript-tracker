const response = require("cfn-response");
const AWS = require("aws-sdk");
const lambda = new AWS.Lambda();


exports.handler = function (event, context) {
  console.log("Request received:\n", JSON.stringify(event));
  let physicalResourceId = event.ResourceProperties.FunctionName;
  const respond = (e) => response.send(event, context, e ? response.FAILED : response.SUCCESS, e ? e : {}, physicalResourceId);
  process.on('uncaughtException', e=>respond(e));
  try {
    if (event.RequestType === 'Create') {
    lambda.invoke({
      FunctionName: physicalResourceId,
      Payload: JSON.stringify(event)
    }).promise()
      .then(_ => respond())
      .catch(e => respond(e));
    } else {
      respond()
    }
  } catch (e) { respond(e); }
};
