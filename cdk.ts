import * as cdk from '@aws-cdk/core';
import * as ecs from "@aws-cdk/aws-ecs";

class AppStack extends cdk.Stack {
    public readonly cluster: ServicesCluster;

    constructor(scope: cdk.Construct, id: string, props?: {}) {
        super(scope, id, props);
        this.cluster = new ServicesCluster(this, 'ServicesCluster');
    }
}

class ServicesCluster extends cdk.Construct {
    public readonly cluster: ecs.Cluster;

    constructor(scope: cdk.Construct, id: string) {
        super(scope, id);

        this.cluster = new ecs.Cluster(this, 'Cluster');
    }
}

const app = new cdk.App();
new AppStack(app, 'LaravelSampleStack');
app.synth();