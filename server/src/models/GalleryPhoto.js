import mongoose from 'mongoose';

const galleryPhotoSchema = new mongoose.Schema(
  {
    filename: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
    caption: { type: String, trim: true, default: '' },
    category: { type: String, trim: true, default: 'General' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

galleryPhotoSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

const GalleryPhoto = mongoose.model('GalleryPhoto', galleryPhotoSchema);
export default GalleryPhoto;
