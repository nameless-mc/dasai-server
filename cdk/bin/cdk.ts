#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { VpcStack } from "../lib/vpc-stack";
import { config } from "../lib/env";
import { Ec2Stack } from "../lib/ec2-stack";
import { BucketStack } from "../lib/bucket-stack";

const app = new cdk.App();
const vpc = new VpcStack(app, "VpcStack", {
  env: {
    account: config.account,
    region: config.region,
  },
});
new Ec2Stack(app, "Ec2Stack", {
  env: {
    account: config.account,
    region: config.region,
  },
  vpc: vpc.vpc,
});
new BucketStack(app, "BucketStack", {
  env: {
    account: config.account,
    region: config.region,
  },
});
