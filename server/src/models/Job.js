import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    department: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ['full-time', 'part-time', 'contract', 'internship'],
      default: 'full-time',
    },
    summary: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    requirements: [{ type: String, trim: true }],
    status: {
      type: String,
      enum: ['open', 'closed'],
      default: 'open',
    },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

jobSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

const Job = mongoose.model('Job', jobSchema);
export default Job;
