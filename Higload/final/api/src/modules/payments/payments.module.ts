import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './payment.entity';

import { ClientsModule, Transport } from '@nestjs/microservices';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'rabbit-mq-module',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'payment_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
    TypeOrmModule.forFeature([Payment]),
  ],
  providers: [PaymentsService],
  exports: [PaymentsService],
  controllers: [PaymentsController],
})
export class PaymentsModule {}
