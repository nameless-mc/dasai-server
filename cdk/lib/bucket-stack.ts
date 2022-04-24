import { RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import { CloudFrontAllowedCachedMethods, CloudFrontAllowedMethods, CloudFrontWebDistribution, HttpVersion, OriginAccessIdentity, PriceClass, ViewerProtocolPolicy } from "aws-cdk-lib/aws-cloudfront";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Bucket, BucketAccessControl } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";
import { config } from "./env";

export class BucketStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);
    const originBucket = new Bucket(this, "S3Bucket", {
      bucketName: config.s3bucket,
      // Bucketへの直接アクセスを禁止
      accessControl: BucketAccessControl.PRIVATE,
      // CDK Stack削除時にBucketも削除する
      removalPolicy: RemovalPolicy.DESTROY,
      websiteIndexDocument: "index.html",
      websiteErrorDocument: "index.html",
    });
    // S3 を公開状態にすることなく、S3 へのアクセスを CloudFront からのリクエストに絞る為の仕組み
    const identity = new OriginAccessIdentity(this, "OriginAccessIdentity", {
      comment: `${originBucket.bucketName} access identity`,
    });

    // principalsに設定したアクセス元からのみに S3 バケットのGetObject権限を渡す
    // ポリシーを設定することで、S3 バケットのオブジェクトは CloudFront を介してのみアクセスできる
    const bucketPolicyStatement = new PolicyStatement({
      actions: ["s3:GetObject"],
      effect: Effect.ALLOW,
      principals: [identity.grantPrincipal],
      resources: [`${originBucket.bucketArn}/*`],
    });
    // bucketにポリシーをアタッチ
    originBucket.addToResourcePolicy(bucketPolicyStatement);
    // CloudFrontのdistribution作成
    new CloudFrontWebDistribution(this, "WebDistribution", {
      enableIpV6: true,
      httpVersion: HttpVersion.HTTP2,
      viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: originBucket,
            originAccessIdentity: identity,
          },
          behaviors: [
            {
              isDefaultBehavior: true,
              allowedMethods: CloudFrontAllowedMethods.GET_HEAD,
              cachedMethods: CloudFrontAllowedCachedMethods.GET_HEAD,
              forwardedValues: {
                queryString: false,
              },
            },
          ],
        
        },
      ],
      // 403/404エラーはindex.htmlを表示
      errorConfigurations: [
        {
          errorCode: 403,
          responseCode: 200,
          errorCachingMinTtl: 0,
          responsePagePath: "/index.html",
        },
        {
          errorCode: 404,
          responseCode: 200,
          errorCachingMinTtl: 0,
          responsePagePath: "/index.html",
        },
      ],
      priceClass: PriceClass.PRICE_CLASS_200,
    });
  }
}
