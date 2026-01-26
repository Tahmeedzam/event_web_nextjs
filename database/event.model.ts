import mongoose, { Schema, Document, Model } from 'mongoose';

// Define the Event document interface for type safety
interface IEvent extends Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Helper function to generate URL-friendly slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-'); // Remove consecutive hyphens
}

// Helper function to validate and normalize date to ISO format (YYYY-MM-DD)
function normalizeDateToISO(date: string): string {
  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) {
    throw new Error(`Invalid date format: ${date}. Expected a valid date string.`);
  }
  return parsedDate.toISOString().split('T')[0];
}

// Helper function to validate and normalize time to HH:MM format
function normalizeTime(time: string): string {
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  const cleanedTime = time.trim();
  if (!timeRegex.test(cleanedTime)) {
    throw new Error(`Invalid time format: ${time}. Expected HH:MM format.`);
  }
  return cleanedTime;
}

// Create the Event schema with validation rules
const eventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
      minlength: [1, 'Title cannot be empty'],
    },
    slug: {
      type: String,
      unique: true,
      sparse: true,
    },
    description: {
      type: String,
      required: [true, 'Event description is required'],
      trim: true,
      minlength: [1, 'Description cannot be empty'],
    },
    overview: {
      type: String,
      required: [true, 'Event overview is required'],
      trim: true,
      minlength: [1, 'Overview cannot be empty'],
    },
    image: {
      type: String,
      required: [true, 'Event image is required'],
      trim: true,
      minlength: [1, 'Image URL cannot be empty'],
    },
    venue: {
      type: String,
      required: [true, 'Event venue is required'],
      trim: true,
      minlength: [1, 'Venue cannot be empty'],
    },
    location: {
      type: String,
      required: [true, 'Event location is required'],
      trim: true,
      minlength: [1, 'Location cannot be empty'],
    },
    date: {
      type: String,
      required: [true, 'Event date is required'],
    },
    time: {
      type: String,
      required: [true, 'Event time is required'],
    },
    mode: {
      type: String,
      required: [true, 'Event mode is required'],
      enum: ['online', 'offline', 'hybrid'],
    },
    audience: {
      type: String,
      required: [true, 'Target audience is required'],
      trim: true,
      minlength: [1, 'Audience cannot be empty'],
    },
    agenda: {
      type: [String],
      required: [true, 'Event agenda is required'],
      validate: {
        validator: (arr: string[]) => arr.length > 0,
        message: 'Agenda must contain at least one item',
      },
    },
    organizer: {
      type: String,
      required: [true, 'Organizer name is required'],
      trim: true,
      minlength: [1, 'Organizer cannot be empty'],
    },
    tags: {
      type: [String],
      required: [true, 'Tags are required'],
      validate: {
        validator: (arr: string[]) => arr.length > 0,
        message: 'Tags must contain at least one item',
      },
    },
  },
  { timestamps: true }
);

// Pre-save hook: Generate slug from title if title is new or changed
eventSchema.pre<IEvent>('save', function (next) {
  if (this.isNew || this.isModified('title')) {
    this.slug = generateSlug(this.title);
  }

  // Normalize date to ISO format (YYYY-MM-DD)
  if (this.isModified('date')) {
    this.date = normalizeDateToISO(this.date);
  }

  // Normalize time to HH:MM format
  if (this.isModified('time')) {
    this.time = normalizeTime(this.time);
  }
});

// Create and export the Event model
const Event: Model<IEvent> =
  mongoose.models.Event || mongoose.model<IEvent>('Event', eventSchema);

export default Event;
export type { IEvent };
