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
  startCommand(@Ctx() ctx: Context) {
    ctx.reply('Hello!👋\nWhat do you want to do?', actionButtons());
  }

  @Action('list_notes')
  listNotes(ctx: Context) {
    const notes = this.appService.findAll();
    ctx.reply(showList(notes));
  }

  @Action('complete_note')
  completeNote(ctx: Context) {
    ctx.session.type = 'complete';
    ctx.reply('Please send the ID of the note:');
  }

  @Action('edit_note')
  editNote(ctx: Context) {
    ctx.session.type = 'edit';
    ctx.deleteMessage();
    ctx.replyWithHTML(
      'Please send the ID and new text of the note:\n\nFormat: <b>1 | New text</b>',
    );
  }

  @Action('delete_note')
  deleteNote(ctx: Context) {
    ctx.session.type = 'delete';
    ctx.reply('Please send the ID of the note:');
  }

  @On('text')
  getMessage(@Message('text') message: string, @Ctx() ctx: Context) {
    if (!ctx.session.type) return;

    if (ctx.session.type === 'complete') {
      const response = this.appService.completeNote(message);

      const note = notes.find((n) => n.id === message);

      if (!note) {
        ctx.deleteMessage();
        ctx.reply('Note with this ID was not found');
      }

      note.isCompleted = !note.isCompleted;
      ctx.reply(showList(notes));
    }

    if (ctx.session.type === 'edit') {
      const [noteId, noteText] = message.split(' | ');
      const note = notes.find((n) => n.id === noteId);

      if (!note) {
        ctx.deleteMessage();
        ctx.reply('Note with this ID was not found');
      }

      note.text = noteText;
      ctx.reply(showList(notes));
    }

    if (ctx.session.type === 'delete') {
      const note = notes.find((n) => n.id === message);

      if (!note) {
        ctx.deleteMessage();
        ctx.reply('Note with this ID was not found');
      }

      ctx.reply(showList(notes.filter((n) => n.id !== message)));
    }
  }
}
