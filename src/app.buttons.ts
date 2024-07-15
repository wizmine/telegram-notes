import { Markup } from 'telegraf';

export function actionButtons() {
  return Markup.inlineKeyboard(
    [
      Markup.button.callback('📋List', 'list_notes'),
      Markup.button.callback('✅Complete', 'complete_note'),
      Markup.button.callback('✏️Edit', 'edit_note'),
      Markup.button.callback('❌Delete', 'delete_note'),
      Markup.button.callback('⚡️Create', 'create_note'),
    ],
    { columns: 2 },
  );
}
