import * as cdk from '@aws-cdk/core';
import * as ecs from "@aws-cdk/aws-ecs";
import * as ecsPatterns from "@aws-cdk/aws-ecs-patterns";
import { ServiceProps, shortHealthCheck } from '../cdk/shared';

export class Service extends cdk.Construct {
    constructor(
        scope: cdk.Construct,
        id: string,
        props: ServiceProps) {
        super(scope, id);
        this.createService(props.cluster);
    }

    private createService(cluster: ecs.Cluster) {
        const taskDefinition = this.createTaskDefinitions();
        const service = new ecsPatterns.ApplicationLoadBalancedFargateService(this, 'Frontend', {
            cluster: cluster,
            taskImageOptions: {
                image: ecs.ContainerImage.fromAsset(__dirname),
            },
            desiredCount: 3,
            memoryLimitMiB: 128
        });

        service.targetGroup.configureHealthCheck(shortHealthCheck);
    }

    private createTaskDefinitions() {
        const taskDefinition = new ecs.FargateTaskDefinition(this,  'TaskDefinition');
        taskDefinition.addVolume({
            name: 'task',
        })

        this.createNginxContainer(taskDefinition);
        this.createFpmContainer(taskDefinition);
        return taskDefinition;
    }


    private createNginxContainer(taskDef: ecs.FargateTaskDefinition) {
        const container = taskDef.addContainer('nginx', {
            image: ecs.ContainerImage.fromAsset(__dirname + '/docker/nginx'),
            logging: new ecs.AwsLogDriver({ streamPrefix: this.node.id + '_nginx'}),
            memoryLimitMiB: 128,
        });
        container.addPortMappings({containerPort: 80});
        container.addMountPoints({
            sourceVolume: 'task',
            containerPath: '/tmp/assets',
            readOnly: false,
        });
        return container;
    }

    private createFpmContainer(taskDef: ecs.FargateTaskDefinition) {
        const container = taskDef.addContainer('fpm', {
            image: ecs.ContainerImage.fromAsset(__dirname),
            logging: new ecs.AwsLogDriver({ streamPrefix: this.node.id + '_fpm'}),
            memoryLimitMiB: 128,
        });

        container.addPortMappings({containerPort:9000});
        container.addMountPoints({
            sourceVolume: 'task',
            containerPath: '/tmp/assets',
            readOnly: false,
        });

        return container;
    }
}
