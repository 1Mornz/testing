import { Router } from 'express';
import express from 'express';
import { createDepositCheckout, fetchPaymentConfig, stripeWebhook } from '../controllers/paymentController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

export const paymentRoutes = Router();

paymentRoutes.get('/payments/config', fetchPaymentConfig);
paymentRoutes.post('/requests/:id/checkout', asyncHandler(createDepositCheckout));
paymentRoutes.post('/stripe/webhook', express.raw({ type: 'application/json' }), asyncHandler(stripeWebhook));
