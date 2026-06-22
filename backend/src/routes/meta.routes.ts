import { Router } from 'express';
import { listCategoriesHandler, searchHandler } from '../controllers/meta.controller.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const categoriesRouter = Router();
categoriesRouter.get('/', listCategoriesHandler);

export const searchRouter = Router();
searchRouter.get('/', asyncHandler(searchHandler));
