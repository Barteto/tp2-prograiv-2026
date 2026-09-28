import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { makeApp } from '../../src/app';

describe('DELETE /notes/:id', () => {
  it('elimina una nota existente y responde 204', async () => {
    const app = makeApp(':memory:');

    const creada = await request(app)
      .post('/notes')
      .send({ title: 'Nota a borrar', content: 'contenido' });
    const id = creada.body.id;

    const res = await request(app).delete(`/notes/${id}`);
    expect(res.status).toBe(204);

    const lista = await request(app).get('/notes');
    expect(lista.body.find((n: any) => n.id === id)).toBeUndefined();
  });

  it('responde 404 si la nota no existe', async () => {
    const app = makeApp(':memory:');
    const res = await request(app).delete('/notes/9999');
    expect(res.status).toBe(404);
  });
});