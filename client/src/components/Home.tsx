import React, { useEffect, useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { CiEdit } from "react-icons/ci";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Note {
  _id: string;
  content: string;
}

const Home: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState<string>("");
  const [upNote, setUpNote] = useState<string>("");
  const [editableNoteId, setEditableNoteId] = useState<string | null>(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  const userObj = user ? JSON.parse(user) : null;

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const fetchNotes = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/note`, {
        headers,
      });
      setNotes(res.data);
    } catch (err) {
      console.error("Error fetching notes", err);
    }
  };

  useEffect(() => {
    if (!token || !user) navigate("/signin");
    fetchNotes();
  }, []);

  const handleEditClick = (id: string, currentContent: string) => {
    setEditableNoteId(id);
    setUpNote(currentContent);
  };

  const handleCreateNote = async () => {
    if (!newNote.trim()) return;
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/note`,
        { content: newNote },
        { headers }
      );
      setNotes([res.data, ...notes]);
      setNewNote("");
    } catch (err) {
      console.error("Error creating note", err);
    }
  };

  const handleUpdate = async (id: string) => {
    if (!upNote.trim()) return;
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/note/${id}`,
        { content: upNote },
        { headers }
      );

      // Update the local notes array
      const updatedNotes = notes.map((note) =>
        note._id === id ? res.data : note
      );

      setNotes(updatedNotes);
      setEditableNoteId(null);
      setUpNote("");
    } catch (err) {
      console.error("Error updating note", err);
    }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/note/${id}`, {
        headers,
      });
      setNotes(notes.filter((note) => note._id !== id));
    } catch (err) {
      console.error("Error deleting note", err);
    }
  };

  return (
    <div className="p-4 flex flex-col gap-7 sm:mx-45">
      {/* nav div */}
      <div className="flex justify-between items-center ">
        <div className="flex gap-3 sm:gap-9 justify-between items-center">
          <img src="/top.svg" alt="logo" />
          <p className="font-semibold text-2xl">Dashboard</p>
        </div>
        <p
          className="font-medium text-blue-600 underline cursor-pointer"
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/signin");
          }}
        >
          Sign Out
        </p>
      </div>

      {/* greeting box */}
      <div className="flex gap-2 flex-col rounded-2xl sm:flex-row px-3 py-7 justify-center sm:justify-around sm:p-6 shadow-md/30 inset-shadow-2xs ">
        <p className="font-bold text-2xl">Welcome, {userObj?.name}!</p>
        <p className="text-lg">Email: {userObj?.email}</p>
      </div>

      {/* add note */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="w-full">
          <input
            type="text"
            placeholder="Enter note ..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={handleCreateNote}
          className="w-full py-2 rounded-md transition cursor-pointer bg-blue-600 font-medium text-white"
        >
          Create Note
        </button>
      </div>

      {/* list notes */}
      <div className="flex flex-col gap-3 ">
        <p className="font-semibold text-xl">Notes</p>
        {notes.map((item) => (
          <div
            key={item._id}
            className="flex p-3 sm:px-5 justify-between items-center shadow-md/30 rounded-xl inset-shadow-2xs"
          >
            <div className="text-lg w-full">
              {editableNoteId === item._id ? (
                <div className="flex gap-2 w-full">
                  <input
                    type="text"
                    value={upNote}
                    onChange={(e) => setUpNote(e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => handleUpdate(item._id)}
                    className="text-sm text-white bg-green-600 px-3 py-1 mr-3 rounded-md"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <p>{item.content}</p>
              )}
            </div>
            <div className="flex gap-3 sm:gap-10">
              <CiEdit
                className="text-xl cursor-pointer"
                onClick={() => handleEditClick(item._id, item.content)}
              />
              <RiDeleteBin6Line
                className="text-xl cursor-pointer"
                onClick={() => handleDeleteNote(item._id)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
