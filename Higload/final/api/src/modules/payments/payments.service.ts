import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from './payment.entity';

@Injectable()
export class PaymentsService extends TypeOrmCrudService<Payment> {
  constructor(
    @InjectRepository(Payment) repo,
    @Inject('rabbit-mq-module') private readonly client: ClientProxy,
  ) {
    super(repo);
  }

  sendProcessPayment(payload: Payment) {
    this.client.send('process_payment', payload).toPromise();
  }
}
