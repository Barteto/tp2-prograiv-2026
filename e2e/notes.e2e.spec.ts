import { test, expect } from '@playwright/test';
import { resetAndSeed } from './helpers';

test.describe('Notes API - E2E', () => {
    test.beforeEach(async ({ baseURL }) => {
        await resetAndSeed(baseURL!);
    });

    test('happy path: crear, listar, obtener, modificar y eliminar una nota', async ({
        request,
    }) => {
    // Crear
    const createResponse = await request.post('/notes', {
        data: {
            title: 'Nota E2E',
            content: 'Contenido de prueba E2E',
        },
    });

    expect(createResponse.status()).toBe(201);

    const createdNote = await createResponse.json();

    expect(createdNote.title).toBe('Nota E2E');
    expect(createdNote.content).toBe('Contenido de prueba E2E');
    expect(createdNote.id).toBeDefined();

    const id = createdNote.id;

    // Listar
    const listResponse = await request.get('/notes');

    expect(listResponse.status()).toBe(200);

    const notes = await listResponse.json();

    expect(notes).toEqual(
        expect.arrayContaining([
        expect.objectContaining({
            id,
            title: 'Nota E2E',
            content: 'Contenido de prueba E2E',
        }),
        ]),
    );

    // Obtener
    const getResponse = await request.get(`/notes/${id}`);

    expect(getResponse.status()).toBe(200);

    const note = await getResponse.json();

    expect(note.id).toBe(id);
    expect(note.title).toBe('Nota E2E');

    // Modificar
    const updateResponse = await request.patch(`/notes/${id}`, {
        data: {
            content: 'Contenido modificado E2E',
        },
    });

    expect(updateResponse.status()).toBe(200);

    const updatedNote = await updateResponse.json();

    expect(updatedNote.id).toBe(id);
    expect(updatedNote.title).toBe('Nota E2E');
    expect(updatedNote.content).toBe('Contenido modificado E2E');

    // Eliminar
    const deleteResponse = await request.delete(`/notes/${id}`);

    expect(deleteResponse.status()).toBe(204);

    // Verificar que ya no existe
    const getDeletedResponse = await request.get(`/notes/${id}`);

    expect(getDeletedResponse.status()).toBe(404);
    });

    test('error: obtener una nota inexistente devuelve 404', async ({
        request,
    }) => {
    const response = await request.get('/notes/999999');

    expect(response.status()).toBe(404);

    const body = await response.json();

    expect(body).toEqual({
        error: 'NotFound',
    });
    });
});