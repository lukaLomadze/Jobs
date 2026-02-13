import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({
  timestamps: true,
})
export class Application {
  @Prop({ type: mongoose.Types.ObjectId, ref: 'vacancy', required: true })
  vacancyId: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'user', required: true })
  userId: mongoose.Types.ObjectId;

  @Prop({ type: String, required: true }) // S3 file key/URL
  cvFileUrl: string;
}

export const applicationSchema = SchemaFactory.createForClass(Application);
