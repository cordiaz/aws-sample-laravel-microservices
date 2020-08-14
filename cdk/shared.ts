import * as cdk from "@aws-cdk/core";
import * as ecs from "@aws-cdk/aws-ecs";
import * as elbv2 from "@aws-cdk/aws-elasticloadbalancingv2" 
import * as servicediscovery from "@aws-cdk/aws-servicediscovery";

interface ServiceProps {
    cluster: ecs.Cluster
    namespace?: servicediscovery.PrivateDnsNamespace
}

const shortHealthCheck: elbv2.HealthCheck = {
    "interval": cdk.Duration.seconds(5),
    "timeout": cdk.Duration.seconds(4),
    "healthyThresholdCount": 2,
    "unhealthyThresholdCount": 2,
    "healthyHttpCodes": "200,301,302"
}

export {ServiceProps, shortHealthCheck};
