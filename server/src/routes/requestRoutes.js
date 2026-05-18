import { Router } from 'express';
import { createQuoteRequest, fetchRequest, fetchRequests, patchRequestStatus } from '../controllers/requestController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { uploadPhotos } from '../middleware/upload.js';

export const requestRoutes = Router();

requestRoutes.post('/public/:slug/requests', uploadPhotos.array('photos', 6), asyncHandler(createQuoteRequest));
requestRoutes.get('/requests', asyncHandler(fetchRequests));
requestRoutes.get('/requests/:id', asyncHandler(fetchRequest));
requestRoutes.patch('/requests/:id/status', asyncHandler(patchRequestStatus));
