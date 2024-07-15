import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Note } from './schemas/note.schema';
import { Model } from 'mongoose';

@Injectable()
export class AppService {
  constructor(@InjectModel(Note.name) private noteModel: Model<Note>) {}

  async createNote(text: string): Promise<Note> {
    const newNote = new this.noteModel({ text, isCompleted: false });
    return newNote.save();
  }

  async findAll(): Promise<Note[]> {
    return this.noteModel.find().exec();
  }

  async findOne(id: string): Promise<Note> {
    return this.noteModel.findById(id).exec();
  }

  async completeNote(id: string, isCompleted: boolean): Promise<Note> {
    return this.noteModel
      .findByIdAndUpdate(id, { isCompleted: !isCompleted }, { new: true })
      .exec();
  }

  async updateNote(id: string, text: string): Promise<Note> {
    return this.noteModel.findByIdAndUpdate(id, { text }, { new: true }).exec();
  }

  async deleteNote(id: string): Promise<Note> {
    return this.noteModel.findByIdAndDelete(id).exec();
  }
}
