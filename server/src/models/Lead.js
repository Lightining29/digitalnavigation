import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    company: { type: String, trim: true, default: '' },
    phone: { type: String, trim: true, default: '' },
    message: { type: String, trim: true, default: '' },
    subject: { type: String, default: '' },
    type: {
      type: String,
      enum: ['contact', 'demo', 'support', 'job'],
      default: 'contact',
    },
    productRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    jobRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
    status: {
      type: String,
      enum: ['new', 'contacted', 'closed'],
      default: 'new',
    },
  },
  { timestamps: true }
);

leadSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

const Lead = mongoose.model('Lead', leadSchema);
export default Lead;
