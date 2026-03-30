import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom, Observable } from 'rxjs';
import { ServiceStatus } from './graphql.types';

interface EmptyRequest {}

interface StatusResponse {
  service: string;
  status: string;
}

interface StatusClient {
  getStatus(payload: EmptyRequest): Observable<StatusResponse>;
}

@Injectable()
export class GatewayService implements OnModuleInit {
  private authClient!: StatusClient;
  private paymentClient!: StatusClient;
  private orderClient!: StatusClient;
  private productClient!: StatusClient;

  constructor(
    @Inject('AUTH_PACKAGE') private readonly authPackage: ClientGrpc,
    @Inject('PAYMENT_PACKAGE') private readonly paymentPackage: ClientGrpc,
    @Inject('ORDER_PACKAGE') private readonly orderPackage: ClientGrpc,
    @Inject('PRODUCT_PACKAGE') private readonly productPackage: ClientGrpc,
  ) {}

  onModuleInit() {
    this.authClient = this.authPackage.getService<StatusClient>('AuthService');
    this.paymentClient =
      this.paymentPackage.getService<StatusClient>('PaymentService');
    this.orderClient = this.orderPackage.getService<StatusClient>('OrderService');
    this.productClient =
      this.productPackage.getService<StatusClient>('ProductService');
  }

  async getServicesStatus(): Promise<ServiceStatus[]> {
    const [auth, payment, order, product] = await Promise.all([
      firstValueFrom(this.authClient.getStatus({})),
      firstValueFrom(this.paymentClient.getStatus({})),
      firstValueFrom(this.orderClient.getStatus({})),
      firstValueFrom(this.productClient.getStatus({})),
    ]);

    return [auth, payment, order, product];
  }
}
