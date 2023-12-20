import { Document, Types } from "mongoose";
import { IProduct } from "../product/product.interface";
import IUser from "../user/user.interface";

export interface IOrder extends Document {
  user: IUser["_id"] | IUser;
  cartId: string;
  invoiceId?: string;
  paymentStatus: "payment_not_paid" | "payment_paid" | "payment_failed";
  totalPrice: number;
  totalQuantity: number;
  city: string;
  phone: string;
  active: boolean;
  tracking?: {path: string, orderNumberTracking: string}[]
  status:
    | "initiated"
    | "created"
    | "on going"
    | "on delivered"
    | "completed"
    | "refund";
  // status: "initiated" | "created" | "in delivery" | "delivered" | "return";
  name: string;
  area: string;
  address: string;
  postalCode: string;
  orderNotes?: string;
  email?: string;
  verificationCode: string;
  isVerified: boolean;
  verificationCodeExpiresAt: number; // 1 hour
  paymentType: "online" | "cash" | "both";
  sendToDelivery: boolean;
  payWith: {
    type: "creditcard" | "applepay" | "stcpay" | "none";
    source?: {
      type: string;
      company: string;
      name: string;
      number: string;
      gateway_id: string;
      reference_number: string | null;
      token: string | null;
      message: string | null;
      transaction_url: string;
    } & (
      | ({
          type: "creditcard";
        } & {
          company: string;
          name: string;
          number: string;
          message?: string;
          reference_number?: string;
        })
      | ({
          type: "applepay";
        } & {
          transaction: {};
        })
      | ({
          type: "stcpay";
        } & {
          transaction: {};
        })
    );
  };
  onlineItems: {
    items: {
      product: IProduct["_id"] | IProduct;
      quantity: number;
      totalPrice: number;
      properties?: {
        key_en: string;
        key_ar: string;
        value_en: string;
        value_ar: string;
      }[];
      repositories:[
        {
          repository: Types.ObjectId;
          quantity: number;
        }
      ]
    }[];
    quantity: number;
    totalPrice: number;
  };
  cashItems: {
    items: {
      product: IProduct["_id"] | IProduct;
      quantity: number;
      totalPrice: number;
      properties?: {
        key_en: string;
        key_ar: string;
        value_en: string;
        value_ar: string;
      }[];
      repositories:[
        {
          repository: Types.ObjectId;
          quantity: number;
        }
      ]
    }[];
    quantity: number;
    totalPrice: number;
    active: boolean;
  };
}
