import * as cdk from '@aws-cdk/core';
import * as ecs from "@aws-cdk/aws-ecs";
import * as ecsPatterns from "@aws-cdk/aws-ecs-patterns";
import { ServiceProps, shortHealthCheck } from '../cdk/shared';

export class Service extends cdk.Construct {
    public dns: string;

    constructor(
        scope: cdk.Construct,
        id: string,
        props: ServiceProps) {
        super(scope, id);
        this.createService(props.cluster);
    }

    private createService(cluster: ecs.Cluster) {
        const taskDefinition = this.createTaskDefinitions();
        const service = new ecsPatterns.ApplicationLoadBalancedFargateService(this, 'Service', {
            cluster: cluster,           
            taskDefinition: taskDefinition,
            desiredCount: 4,
        });
        this.dns = service.loadBalancer.loadBalancerDnsName;
        service.targetGroup.configureHealthCheck(shortHealthCheck);
    }

    private createTaskDefinitions() {
        const taskDefinition = new ecs.FargateTaskDefinition(this,  'TaskDefinition');
        taskDefinition.addVolume({
            name: 'task',
        })

        this.createNginxContainer(taskDefinition);
        this.createFpmContainer(taskDefinition);
        this.createXRayContainer(taskDefinition);

        return taskDefinition;
    }

    private createNginxContainer(taskDef: ecs.FargateTaskDefinition) {
        const container = taskDef.addContainer('nginx', {
            image: ecs.ContainerImage.fromAsset(__dirname + '/docker/nginx'),
            logging: new ecs.AwsLogDriver({ streamPrefix: this.node.id + '_nginx'}),
            memoryLimitMiB: 128,
        });
        container.addPortMappings({containerPort: 80});

        return container;
    }

    private createFpmContainer(taskDef: ecs.FargateTaskDefinition) {
        const container = taskDef.addContainer('fpm', {
            image: ecs.ContainerImage.fromAsset(__dirname),
            logging: new ecs.AwsLogDriver({ streamPrefix: this.node.id + '_fpm'}),
            memoryLimitMiB: 128,
        });

        container.addPortMappings({containerPort:9000});

        return container;
    }

    private createXRayContainer(taskDef: ecs.FargateTaskDefinition) {
        const container = taskDef.addContainer('xray-daemon', {
            image: ecs.ContainerImage.fromRegistry('amazon/aws-xray-daemon'),
            cpu: 32,
            memoryReservationMiB: 256,
        })
        container.addPortMappings({containerPort: 2000, protocol: ecs.Protocol.UDP});
        return container;
    }
}
