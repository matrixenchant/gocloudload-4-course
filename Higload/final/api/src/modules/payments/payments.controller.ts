import {
  Crud,
  CrudController,
  CrudRequest,
  Override,
  ParsedRequest,
} from '@dataui/crud';
import { Body, Controller, Post } from '@nestjs/common';
import { Payment } from './payment.entity';
import { PaymentsService } from './payments.service';

@Crud({
  model: {
    type: Payment,
  },
})
@Controller('payments')
export class PaymentsController implements CrudController<Payment> {
  constructor(public service: PaymentsService) {}

  get base(): CrudController<Payment> {
    return this;
  }

  @Override('createOneBase')
  async getAllCached(@ParsedRequest() req: CrudRequest, @Body() dto: Payment) {
    const res = await this.base.createOneBase(req, dto);
    this.service.sendProcessPayment(dto);
    return res;
  }

  @Post('process')
  async processPayment(@Body() paymentDto: Payment) {
    return this.service.sendProcessPayment(paymentDto);
  }
}
