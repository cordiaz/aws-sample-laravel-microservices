import * as cdk from '@aws-cdk/core';
import * as ecs from "@aws-cdk/aws-ecs";
import { Service as FrontendService } from './frontend/cdk'
import { Service as Service1 } from './service1/cdk'
import { Service as Service2 } from './service2/cdk'
import { Service as Service3 } from './service3/cdk'

class AppStack extends cdk.Stack {
    public readonly cluster: ServicesCluster;

    constructor(scope: cdk.Construct, id: string, props?: {}) {
        super(scope, id, props);
        this.cluster = new ServicesCluster(this, 'ServicesCluster');
        
        new FrontendService(this, 'Frontend', {
            cluster: this.cluster.cluster  
        });
        new Service1(this, 'Service1', {
            cluster: this.cluster.cluster  
        });
        new Service2(this, 'Service2', {
            cluster: this.cluster.cluster  
        });
        new Service3(this, 'Service3', {
            cluster: this.cluster.cluster  
        });
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