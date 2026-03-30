import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { PROTO_PATHS } from '@ecommerce/proto-contracts';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.GRPC,
    options: {
      package: 'order',
      protoPath: PROTO_PATHS.order,
      url: process.env.GRPC_URL ?? '0.0.0.0:50053',
    },
  });

  await app.listen();
}
bootstrap();
