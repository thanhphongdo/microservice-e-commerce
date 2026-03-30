import { join } from 'path';

export * as AuthProto from './generated/auth';
export * as PaymentProto from './generated/payment';
export * as OrderProto from './generated/order';
export * as ProductProto from './generated/product';

const protoRoot = join(__dirname, '..', 'proto');

export const PROTO_PATHS = {
  auth: join(protoRoot, 'auth.proto'),
  payment: join(protoRoot, 'payment.proto'),
  order: join(protoRoot, 'order.proto'),
  product: join(protoRoot, 'product.proto'),
} as const;
