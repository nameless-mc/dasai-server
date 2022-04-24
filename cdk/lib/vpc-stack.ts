import { App, Stack, StackProps } from "aws-cdk-lib";
import {
  IVpc,
  SubnetType,
  Vpc,
} from "aws-cdk-lib/aws-ec2";

export class VpcStack extends Stack {
  public readonly vpc: IVpc;

  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    this.vpc = new Vpc(this, "Vpc", {
      cidr: "172.17.0.0/16",
      natGateways: 0, // NatGatewayはお金がかかるので使わない
      maxAzs: 1, // Availability Zoneの数
      subnetConfiguration: [
        { name: "Public", cidrMask: 20, subnetType: SubnetType.PUBLIC },
      ],
    });
  }
}
