import { redirect } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import NewNote, { links as newNoteLinks } from "~/components/NewNote";
import NoteList, { links as noteLinks } from "~/components/NoteList";
import { getStoredNotes, storeNotes } from "~/data/notes";

export default function NotesPage() {
  const notes = useLoaderData();
  return (
    <main>
      <NewNote />
      <NoteList notes={notes} />
    </main>
  );
}

export async function loader() {
  const notes = await getStoredNotes();
  return notes;
}

export async function action({ request }) {
  const formData = await request.formData();
  const noteData = Object.fromEntries(formData);
  if (noteData.title.trim().length < 5) {
    return {
      message: "Invalid title: Title must be at least 5 characters long",
    };
  }
  const existingNotes = await getStoredNotes();
  noteData.id = new Date().toISOString();
  const updatedNotes = [...existingNotes, noteData];
  await storeNotes(updatedNotes);

  // delay to check loading on notes list page
  // await new Promise((resolve, reject) => setTimeout(() => resolve(), 2000));

  return redirect("/notes");
}

export function links() {
  return [...newNoteLinks(), ...noteLinks()];
}

export function ErrorBoundary({ error }) {
  return (
    <main className="error">
      <h1>An error occurred in Notes</h1>
      <p>{error.message}</p>
      <p>
        Back to <Link to="/">safety</Link>
      </p>
    </main>
  );
}
