import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Role } from '../../enum/role.enum';

@Schema({
  timestamps: true,
})
export class User {
  @Prop({ type: String, required: true })
  fullName: string;

  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({ type: String, required: true, select: false })
  password: string;

  @Prop({ type: String, enum: Role, required: true })
  role: Role;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'company', default: null })
  companyId: mongoose.Types.ObjectId;
}

export const userSchema = SchemaFactory.createForClass(User);
