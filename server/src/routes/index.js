import { Router } from 'express';
import { providerRoutes } from './providerRoutes.js';
import { requestRoutes } from './requestRoutes.js';
import { paymentRoutes } from './paymentRoutes.js';

export const apiRoutes = Router();

apiRoutes.use(providerRoutes);
apiRoutes.use(requestRoutes);
apiRoutes.use(paymentRoutes);
