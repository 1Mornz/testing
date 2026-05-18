import { Router } from 'express';
import { fetchProvider, fetchPublicProvider, upsertProvider } from '../controllers/providerController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

export const providerRoutes = Router();

providerRoutes.get('/provider', asyncHandler(fetchProvider));
providerRoutes.put('/provider', asyncHandler(upsertProvider));
providerRoutes.get('/public/:slug', asyncHandler(fetchPublicProvider));
