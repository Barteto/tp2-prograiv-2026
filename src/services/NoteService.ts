import { NoteRepository } from '../repositories/NoteRepository';
import { Note, NewNote, NotePatch } from '../models/Note';
import { notify } from './notificationService';

// Contrato fijo. Las rutas (src/routes/notes.ts) y los tests de la cátedra
// llaman a estos 5 métodos por su nombre exacto: no los renombren.
export interface NoteService {
  createNote(data: NewNote): Note;
  listNotes(): Note[];
  getNote(id: number): Note | undefined;
  updateNote(id: number, patch: NotePatch): Note | undefined;
  deleteNote(id: number): boolean;
}

// 🟢 EJERCICIO 1:
export class NoteServiceImpl implements NoteService {
  constructor(private readonly repo: NoteRepository) {}

  createNote(data: NewNote): Note {
    const note = this.repo.create(data);

    if (data.pinned) {
      notify(note);
    }

    return note;
  }

  listNotes(): Note[] {
    // 🟢 EJERCICIO 2: esta función YA FUNCIONA.
    return this.repo.findAll();
  }

  getNote(id: number): Note | undefined {
    // 🔴🟢 EJERCICIO 3: ciclo completo (test + implementación).
    throw new Error('getNote: no implementado (Ejercicio 3)');
  }

  updateNote(id: number, patch: NotePatch): Note | undefined {
    // 🔴🟢 EJERCICIO 4: ciclo completo.
    // Es una actualización PARCIAL.
    throw new Error('updateNote: no implementado (Ejercicio 4)');
  }

  deleteNote(id: number): boolean {
    // 🔴🟢 EJERCICIO 5: ciclo completo.
    throw new Error('deleteNote: no implementado (Ejercicio 5)');
  }
}