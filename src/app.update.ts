import {
  Action,
  Ctx,
  InjectBot,
  Message,
  On,
  Start,
  Update,
} from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { actionButtons } from './app.buttons';
import { Context } from './context.interface';
import { showList } from './app.utils';
import { AppService } from './app.service';

@Update()
export class AppUpdate {
  constructor(
    @InjectBot() private readonly bot: Telegraf<Context>,
    private readonly appService: AppService,
  ) {}

  @Start()
  async startCommand(@Ctx() ctx: Context) {
    ctx.reply('Hello!👋\nWhat do you want to do?', actionButtons());
  }

  @Action('create_note')
  async createNote(@Ctx() ctx: Context) {
    ctx.session.type = 'create';
    ctx.reply('Describe your note');
  }

  @Action('list_notes')
  async listNotes(@Ctx() ctx: Context) {
    const notes = await this.appService.findAll();
    ctx.reply(showList(notes));
  }

  @Action('complete_note')
  async completeNote(@Ctx() ctx: Context) {
    ctx.session.type = 'complete';
    ctx.reply('Please send the ID of the note:');
  }

  @Action('edit_note')
  async editNote(@Ctx() ctx: Context) {
    ctx.session.type = 'edit';
    ctx.deleteMessage();
    ctx.replyWithHTML(
      'Please send the ID and new text of the note:\n\nFormat: <b>1 | New text</b>',
    );
  }

  @Action('delete_note')
  async deleteNote(@Ctx() ctx: Context) {
    ctx.session.type = 'delete';
    ctx.reply('Please send the ID of the note:');
  }

  @On('text')
  async getMessage(@Message('text') message: string, @Ctx() ctx: Context) {
    if (!ctx.session.type) return;

    if (ctx.session.type === 'create') {
      await this.appService.createNote(message);
      const notes = await this.appService.findAll();
      ctx.reply(showList(notes));
    }

    if (ctx.session.type === 'complete') {
      const note = await this.appService.findOne(message);
      if (!note) {
        ctx.deleteMessage();
        ctx.reply('Note with this ID was not found');
        return;
      }
      await this.appService.completeNote(message, !note.isCompleted);
      const notes = await this.appService.findAll();
      ctx.reply(showList(notes));
    }

    if (ctx.session.type === 'edit') {
      const [noteId, noteText] = message.split(' | ');
      const note = await this.appService.findOne(noteId);
      if (!note) {
        ctx.deleteMessage();
        ctx.reply('Note with this ID was not found');
        return;
      }
      await this.appService.updateNote(noteId, noteText);
      const notes = await this.appService.findAll();
      ctx.reply(showList(notes));
    }

    if (ctx.session.type === 'delete') {
      const note = await this.appService.findOne(message);
      if (!note) {
        ctx.deleteMessage();
        ctx.reply('Note with this ID was not found');
        return;
      }
      await this.appService.deleteNote(message);
      const notes = await this.appService.findAll();
      ctx.reply(showList(notes));
    }

    ctx.session.type = null;
  }
}
