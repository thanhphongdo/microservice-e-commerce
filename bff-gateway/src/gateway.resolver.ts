import { Query, Resolver } from '@nestjs/graphql';
import { ServiceStatus } from './graphql.types';
import { GatewayService } from './gateway.service';

@Resolver(() => ServiceStatus)
export class GatewayResolver {
  constructor(private readonly gatewayService: GatewayService) {}

  @Query(() => [ServiceStatus], { name: 'servicesStatus' })
  getServicesStatus() {
    return this.gatewayService.getServicesStatus();
  }
}
