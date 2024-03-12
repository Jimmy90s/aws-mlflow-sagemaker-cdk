#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { MLflowVpcStack } from "../lib/mlflow-vpc-stack";
import { HttpGatewayStack } from "../lib/http-gateway-stack";
import { SageMakerStudioUserStack } from "../lib/sagemaker-studio-user-stack";

// Only if in Cloud9
// const env = {
//     region: process.env["AWS_REGION"] || "us-west-2",
//     account: process.env["AWS_ACCOUNT"] || "664947382407",
//   };

const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const domainId = process.env["DOMAIN_ID"] || "";
const mlflowSecretName = "mlflow-server-credentials";

const app = new cdk.App();

const mlflowVpcStack = new MLflowVpcStack(
  app,
  "MLflowVpcStack",
  mlflowSecretName,
  { env: env }
);

const httpGatewayStack = new HttpGatewayStack(
  app,
  "HttpGatewayStack",
  mlflowVpcStack.vpc,
  mlflowVpcStack.httpApiListener,
  { env: env }
);

new SageMakerStudioUserStack(
  app,
  "SageMakerStudioUserStack",
  mlflowVpcStack.mlflowSecretArn,
  "HttpGatewayStack",
  domainId,
  { env: env }
);
