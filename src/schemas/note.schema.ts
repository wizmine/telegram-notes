import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Note extends Document {
  @Prop({ required: true })
  text: string;

  @Prop({ required: true })
  isCompleted: boolean;
}

export const NoteSchema = SchemaFactory.createForClass(Note);
