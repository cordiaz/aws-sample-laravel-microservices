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
        
        const service1 = new Service1(this, 'Service1', {
            cluster: this.cluster.cluster  
        });
        const service2 = new Service2(this, 'Service2', {
            cluster: this.cluster.cluster  
        });
        const service3 = new Service3(this, 'Service3', {
            cluster: this.cluster.cluster  
        });

        new FrontendService(this, 'Frontend', {
            cluster: this.cluster.cluster,
            environments: {
                SERVICE1_HOST: service1.dns,
                SERVICE2_HOST: service2.dns,
                SERVICE3_HOST: service3.dns,
            }
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