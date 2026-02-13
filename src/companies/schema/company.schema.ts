import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({
  timestamps: true,
})
export class Company {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String })
  description: string;

  @Prop({ type: String, required: true })
  email: string;

  @Prop({ type: String })
  phone: string;

  @Prop({ type: String })
  website: string;

  @Prop({ type: String })
  logo: string;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'user', required: true })
  userId: mongoose.Types.ObjectId;

  @Prop({ type: Boolean, default: false })
  isApproved: boolean;
}

export const companySchema = SchemaFactory.createForClass(Company);
