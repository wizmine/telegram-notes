export const showList = (notes) =>
  `Notes list\n\n${notes.map((note) => (note.isCompleted ? '✅' : '⚪️') + ' ' + note.text + '\n' + 'ID: ' + note.id + '\n\n').join('')}`;
