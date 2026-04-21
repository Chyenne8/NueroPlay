import { motion } from "framer-motion";
import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { X, Plus, Trash2, Calendar, Tag } from 'lucide-react';

interface Note {
  id: string;
  date: string;
  text: string;
  tags: string[];
  mood?: string;
}

interface CaregiverNotesProps {
  childUsername: string;
  onClose: () => void;
}

const commonTags = [
  '💪 Strength',
  '🎯 Challenge',
  '😊 Positive',
  '😰 Trigger',
  '🎉 Breakthrough',
  '💡 Insight',
  '📝 Behavior',
  '🌟 Progress',
];

export function CaregiverNotes({ childUsername, onClose }: CaregiverNotesProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNoteText, setNewNoteText] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showAddNote, setShowAddNote] = useState(false);

  useEffect(() => {
    // Load notes from localStorage
    const storedNotes = localStorage.getItem(`notes_${childUsername}`);
    if (storedNotes) {
      setNotes(JSON.parse(storedNotes));
    }
  }, [childUsername]);

  const saveNotes = (updatedNotes: Note[]) => {
    localStorage.setItem(`notes_${childUsername}`, JSON.stringify(updatedNotes));
    setNotes(updatedNotes);
  };

  const addNote = () => {
    if (!newNoteText.trim()) return;

    const newNote: Note = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      text: newNoteText,
      tags: selectedTags,
    };

    const updatedNotes = [newNote, ...notes];
    saveNotes(updatedNotes);
    setNewNoteText('');
    setSelectedTags([]);
    setShowAddNote(false);
  };

  const deleteNote = (id: string) => {
    if (confirm('Delete this note?')) {
      const updatedNotes = notes.filter(note => note.id !== id);
      saveNotes(updatedNotes);
    }
  };

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-3xl my-8"
      >
        <Card className="p-6 bg-white">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-gray-800 mb-1">Observations & Notes</h2>
              <p className="text-gray-600">Track patterns, behaviors, and insights</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          {/* Add Note Button */}
          {!showAddNote && (
            <Button
              onClick={() => setShowAddNote(true)}
              className="w-full mb-6 bg-purple-500 hover:bg-purple-600 text-white"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add New Note
            </Button>
          )}

          {/* Add Note Form */}
          {showAddNote && (
            <Card className="p-4 mb-6 bg-purple-50 border-2 border-purple-200">
              <h3 className="font-semibold text-gray-800 mb-3">New Note</h3>
              
              <textarea
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                placeholder="What did you observe today? Any behaviors, triggers, or breakthroughs?"
                className="w-full p-3 border-2 border-gray-300 rounded-lg mb-3 min-h-[100px] focus:border-purple-500 focus:outline-none"
              />

              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2 flex items-center gap-1">
                  <Tag className="w-4 h-4" />
                  Add tags (optional):
                </p>
                <div className="flex flex-wrap gap-2">
                  {commonTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1 rounded-full text-sm transition-all ${
                        selectedTags.includes(tag)
                          ? 'bg-purple-500 text-white'
                          : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-purple-300'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={addNote}
                  disabled={!newNoteText.trim()}
                  className="flex-1 bg-purple-500 hover:bg-purple-600 text-white disabled:opacity-50"
                >
                  Save Note
                </Button>
                <Button
                  onClick={() => {
                    setShowAddNote(false);
                    setNewNoteText('');
                    setSelectedTags([]);
                  }}
                  variant="outline"
                  className="border-gray-300"
                >
                  Cancel
                </Button>
              </div>
            </Card>
          )}

          {/* Notes List */}
          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {notes.length === 0 && (
              <Card className="p-8 text-center bg-gray-50 border-2 border-dashed border-gray-300">
                <p className="text-gray-500">No notes yet. Start adding observations!</p>
              </Card>
            )}

            {notes.map(note => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="p-4 border-2 border-gray-200 hover:border-purple-300 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      {formatDate(note.date)}
                    </div>
                    <button
                      onClick={() => deleteNote(note.id)}
                      className="p-1 hover:bg-red-100 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>

                  <p className="text-gray-800 mb-3 whitespace-pre-wrap">{note.text}</p>

                  {note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {note.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Export Button */}
          {notes.length > 0 && (
            <div className="mt-6 pt-4 border-t-2 border-gray-200">
              <p className="text-sm text-gray-600 mb-2">
                💡 Tip: These notes are saved locally. You can share them with therapists or schools.
              </p>
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  );
}
