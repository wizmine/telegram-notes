export const showList = (notes) =>
  notes
    ? `Notes list\n\n${notes.map((note) => (note.isCompleted ? '✅' : '⚪️') + ' ' + note.text + '\n').join('')}`
    : 'Notes not found';
