import mongoose, { Schema, Document, Model, Types } from 'mongoose';
import Event from './event.model';

// Define the Booking document interface for type safety
interface IBooking extends Document {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

// Email validation regex pattern
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Helper function to validate email format
function validateEmail(email: string): boolean {
  return emailRegex.test(email.toLowerCase());
}

// Create the Booking schema with validation rules
const bookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event ID is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      validate: {
        validator: validateEmail,
        message: (props) => `${props.value} is not a valid email address`,
      },
    },
  },
  { timestamps: true }
);

// Create index on eventId for faster queries when filtering bookings by event
bookingSchema.index({ eventId: 1 });

// Pre-save hook: Verify that the referenced eventId exists in the Event collection
bookingSchema.pre('save', async function () {
  const eventExists = await Event.findById(this.eventId);

  if (!eventExists) {
    throw new Error(`Event with ID ${this.eventId} does not exist`);
  }
});


// Create and export the Booking model
const Booking: Model<IBooking> =
  mongoose.models.Booking || mongoose.model<IBooking>('Booking', bookingSchema);

export default Booking;
export type { IBooking };
