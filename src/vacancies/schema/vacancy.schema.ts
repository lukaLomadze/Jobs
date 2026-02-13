import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { VacancyStatus } from '../../enum/vacancy-status.enum';

@Schema({
  timestamps: true,
})
export class Vacancy {
  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: String, required: true })
  category: string;

  @Prop({ type: String, required: true })
  location: string;

  @Prop({ type: Number })
  salaryMin: number;

  @Prop({ type: Number })
  salaryMax: number;

  @Prop({
    type: mongoose.Types.ObjectId,
    ref: 'company',
    required: true,
  })
  companyId: mongoose.Types.ObjectId;

  @Prop({ type: String, enum: VacancyStatus, default: VacancyStatus.PENDING })
  status: VacancyStatus;
}

export const vacancySchema = SchemaFactory.createForClass(Vacancy);
