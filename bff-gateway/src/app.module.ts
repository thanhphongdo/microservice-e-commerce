import { Module } from '@nestjs/common';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PROTO_PATHS } from '@ecommerce/proto-contracts';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { GatewayResolver } from './gateway.resolver';
import { GatewayService } from './gateway.service';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      // Keep schema generation in-memory for containerized production runtime.
      autoSchemaFile: true,
      introspection: process.env.GRAPHQL_INTROSPECTION !== 'false',
      playground: process.env.GRAPHQL_PLAYGROUND !== 'false',
    }),
    ClientsModule.register([
      {
        name: 'AUTH_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'auth',
          protoPath: PROTO_PATHS.auth,
          url: process.env.AUTH_GRPC_URL ?? 'localhost:50051',
        },
      },
      {
        name: 'PAYMENT_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'payment',
          protoPath: PROTO_PATHS.payment,
          url: process.env.PAYMENT_GRPC_URL ?? 'localhost:50052',
        },
      },
      {
        name: 'ORDER_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'order',
          protoPath: PROTO_PATHS.order,
          url: process.env.ORDER_GRPC_URL ?? 'localhost:50053',
        },
      },
      {
        name: 'PRODUCT_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'product',
          protoPath: PROTO_PATHS.product,
          url: process.env.PRODUCT_GRPC_URL ?? 'localhost:50054',
        },
      },
    ]),
  ],
  providers: [GatewayResolver, GatewayService],
})
export class AppModule {}
