import Joi from "joi";
import { IProduct } from "../interfaces/product/product.interface";

const productValidator = Joi.object<IProduct>({
  title_en: Joi.string().alter({
    post: (schema) => schema.required(),
    put: (schema) => schema.optional(),
  }),
  title_ar: Joi.string().alter({
    post: (schema) => schema.required(),
    put: (schema) => schema.optional(),
  }),
  description_en: Joi.string().alter({
    post: (schema) => schema.required(),
    put: (schema) => schema.optional(),
  }),
  description_ar: Joi.string().alter({
    post: (schema) => schema.required(),
    put: (schema) => schema.optional(),
  }),

  priceBeforeDiscount: Joi.number()
    .min(1)
    .alter({
      post: (schema) => schema.required(),
      put: (schema) => schema.optional(),
    }),
  priceAfterDiscount: Joi.number()
    .min(0)
    .max(Joi.ref("priceBeforeDiscount"))
    .alter({
      post: (schema) => schema.optional(),
      put: (schema) => schema.optional(),
    }),
  quantity: Joi.number().min(0).optional(),

  images: Joi.array()
    .items(Joi.string())
    .alter({
      post: (schema) => schema.required(),
      put: (schema) => schema.optional(),
    }),
  paymentType: Joi.string()
    .valid("online", "cash")
    .alter({
      post: (schema) => schema.required(),
      put: (schema) => schema.optional(),
    }),

  keywords: Joi.array().items(Joi.string()),
  attributes: Joi.array()
    // .min(1)
    .items(
      Joi.object({
        key_ar: Joi.string().required(),
        key_en: Joi.string().required(),
        values: Joi.array()
          // .min(1)
          .items(
            Joi.object({
              value_ar: Joi.string().required(),
              value_en: Joi.string().required(),
            })
          )
          // .required(),
      })
    )
    .optional(),
  qualities: Joi.array()
    // .min(1)
    .items(
      Joi.object({
        key_ar: Joi.string().required(),
        key_en: Joi.string().required(),
        values: Joi.array()
          // .min(1)
          .items(
            Joi.object({
              value_ar: Joi.string().required(),
              value_en: Joi.string().required(),
              price: Joi.number().required(),
            })
          )
          // .required(),
      })
    )
    .optional(),
  qualitiesImages: Joi.array()
    // .min(1)
    .items(
      Joi.object({
        image: Joi.string().required(),
        qualities: Joi.array()
          // .min(1)
          .items(
            Joi.object({
              key_ar: Joi.string().required(),
              key_en: Joi.string().required(),
              value_ar: Joi.string().required(),
              value_en: Joi.string().required(),
            })
          )
          // .required(),
      })
    )
    .optional(),
  category: Joi.string()
    .hex()
    .length(24)
    .alter({
      post: (schema) => schema.required(),
      put: (schema) => schema.optional(),
    }),
  subCategory: Joi.string()
    .hex()
    .length(24)
    .alter({
      post: (schema) => schema.optional(),
      put: (schema) => schema.optional(),
    }),
  deliveryType: Joi.string().alter({
    post: (schema) => schema.required(),
    put: (schema) => schema.optional(),
  }),
  weight: Joi.number()
    .min(1)
    .alter({
      post: (schema) => schema.required(),
      put: (schema) => schema.optional(),
    }),
  title_meta: Joi.string().alter({
    post: (schema) => schema.optional(),
    put: (schema) => schema.optional(),
  }),
  desc_meta: Joi.string().alter({
    post: (schema) => schema.optional(),
    put: (schema) => schema.optional(),
  }),
  title: Joi.string().alter({
    post: (schema) => schema.optional(),
    put: (schema) => schema.optional(),
  }),
  message: Joi.string().alter({
    post: (schema) => schema.optional(),
    put: (schema) => schema.optional(),
  }),
  link: Joi.string().alter({
    post: (schema) => schema.optional(),
    put: (schema) => schema.optional(),
  }),
  extention: Joi.string().alter({
    post: (schema) => schema.optional(),
    put: (schema) => schema.optional(),
  }),
  directDownloadLink: Joi.string().alter({
    post: (schema) => schema.optional(),
    put: (schema) => schema.optional(),
  }),
  repoQuantity: Joi.number().alter({
    post: (schema) => schema.optional(),
    put: (schema) => schema.optional(),
  }),
  repoIds: Joi.array()
    .items(Joi.string().hex().length(24))
    .alter({
      post: (schema) => schema.optional(),
      put: (schema) => schema.optional(),
    }),
  
});

export const postProductValidation = productValidator.tailor("post");
export const putProductValidation = productValidator.tailor("put");
