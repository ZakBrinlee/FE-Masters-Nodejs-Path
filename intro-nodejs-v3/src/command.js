import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { newNote, getAllNotes, findNotes, removeNote, removeAllNotes } from './notes.js';
import { start } from './server.js';

const listNotes = (notes) => {
  notes.forEach(note => {
    console.log('\n')
    console.log('id: ', note.id)
    console.log('tags: ', note.tags.join(', ')),
    console.log('note: ', note.content)
  })
}

yargs(hideBin(process.argv))
  .command('new <note>', 'Create a new note', yargs => {
    return yargs.positional('note', {
      type: 'string',
      describe: 'Note to create',
    })
  }, async (argv) => {
    const tags = argv.tags ? argv.tags.split(',') : [];
    const note = await newNote(argv.note, tags);
    console.log(`Note created! : `, note);
  })
  .option('tags', {
    alias: 't',
    type: 'string',
    description: 'Tags for the note',
  })
  .command('all', 'get all notes', () => {}, async (argv) => {
    const notes = await getAllNotes();
    listNotes(notes);
  })
  .command('find <filter>', 'get matching notes', yargs => {
    return yargs.positional('filter', {
      describe: 'The search term to filter notes by, will be applied to note.content',
      type: 'string'
    })
  }, async (argv) => {
    const filter = argv.filter;
    const foundNotes = await findNotes(filter);
    if (foundNotes.length === 0) {
      console.log(`No notes found matching ${filter}`);
      return;
    } else {
      console.log('Note(s) matching filter: ', filter);
      listNotes(foundNotes);
    }
  })
  .command('remove <id>', 'remove a note by id', yargs => {
    return yargs.positional('id', {
      type: 'number',
      description: 'The id of the note you want to remove'
    })
  }, async (argv) => {
    const removedId = await removeNote(argv.id);
    console.log('removedId: ', removedId)    
  })
  .command('web [port]', 'launch website to see notes', yargs => {
    return yargs
      .positional('port', {
        describe: 'port to bind on',
        default: 5000,
        type: 'number'
      })
  }, async (argv) => {
    const notes = await getAllNotes();
    start(notes, argv.port);
  })
  .command('clean', 'remove all notes', () => {}, async (argv) => {
    await removeAllNotes();
    console.log('DB has been reset')
  })
  .demandCommand(1)
  .parse()