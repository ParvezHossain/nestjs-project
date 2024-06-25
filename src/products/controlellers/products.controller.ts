import { Controller, Post, Req } from '@nestjs/common';
import { Request } from 'express';

@Controller('products')
export class ProductController {
    @Post()
    createProduct(@Req() request: Request): any {
        return '';
    }
}

/* 

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './payment.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  async processPayment(paymentDetails: Payment): Promise<boolean> {
    // Check if a payment with the same cart or user already exists
    const existingPayment = await this.paymentRepository.findOne({
      where: {
        cartId: paymentDetails.cartId,
        userId: paymentDetails.userId,
      },
    });

    if (existingPayment) {
      // Duplicate payment found, do not process
      return false;
    }

    // Process the payment and save it in a transaction
    return this.paymentRepository.manager.transaction(async (transactionalEntityManager) => {
      await transactionalEntityManager.save(paymentDetails);
      // Perform payment processing logic here (e.g., call payment gateway, update order status, etc.)
      return true;
    });
  }
}

*/
