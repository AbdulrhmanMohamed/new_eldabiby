import Joi from 'joi';
import { IRepository } from '../interfaces/repository/repository.interface';

  const repositoryValidator = Joi.object<IRepository>({
    name_en: Joi.string().alter({
      create: (schema) => schema.required(),
      update: (schema) => schema.optional(),
    }),
    name_ar: Joi.string().alter({
      create: (schema) => schema.required(),
      update: (schema) => schema.optional(),
    }),
    quantity: Joi.number().default(0),
    products: Joi.array().items(
      Joi.object({
        productId: Joi.string().required(),
        quantity: Joi.number().default(0),
      })
    ),
    address: Joi.string().alter({
      create: (schema) => schema.required(),
      update: (schema) => schema.optional(),
    }),
  });
  
  export const postRepositoryValidation = repositoryValidator;
  export const putRepositoryValidation = repositoryValidator;