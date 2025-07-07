import express, { NextFunction, Request, Response } from 'express';
import Note from '../models/Note';
import User from '../models/User';
import { verifyToken } from '../middlewares/auth';

const router = express.Router();
router.use(verifyToken);

const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Create Note
router.post('/', asyncHandler(async (req: Request, res: Response) => {
  const { content } = req.body;
  const userEmail = (req as any).user.email;

  const user = await User.findOne({ email: userEmail });
  if (!user) return res.status(404).json({ error: 'User not found' });

  const note = await Note.create({
    user: user._id,
    content,
  });

  res.status(201).json(note);
}));

// 📄 Get all notes
router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const userEmail = (req as any).user.email;

  const user = await User.findOne({ email: userEmail });
  if (!user) return res.status(404).json({ error: 'User not found' });

  const notes = await Note.find({ user: user._id }).sort({ _id: -1 });
  res.json(notes);
}));

// Update a note
router.put('/:id', asyncHandler(async (req: Request, res: Response) => {
  const noteId = req.params.id;
  const { content } = req.body;
  const userEmail = (req as any).user.email;

  const user = await User.findOne({ email: userEmail });
  if (!user) return res.status(404).json({ error: 'User not found' });

  const updated = await Note.findOneAndUpdate(
    { _id: noteId, user: user._id },
    { content },
    { new: true }
  );

  if (!updated) return res.status(404).json({ error: 'Note not found' });

  res.json(updated);
}));

// Delete a note
router.delete('/:id', asyncHandler(async (req: Request, res: Response) => {
  const noteId = req.params.id;
  const userEmail = (req as any).user.email;

  const user = await User.findOne({ email: userEmail });
  if (!user) return res.status(404).json({ error: 'User not found' });

  const deleted = await Note.findOneAndDelete({ _id: noteId, user: user._id });

  if (!deleted) return res.status(404).json({ error: 'Note not found' });

  res.json({ message: 'Note deleted successfully' });
}));

export default router;
