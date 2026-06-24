import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true, lowercase: true, trim: true },
  codeHash: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  verified: { type: Boolean, default: false },
}, { timestamps: true });

otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
otpSchema.index({ email: 1 });

otpSchema.statics.generate = async function (email) {
  const code = String(Math.floor(100000 + Math.random() * 900000));
  const codeHash = await bcrypt.hash(code, 8);
  await this.deleteMany({ email: email.toLowerCase() });
  const otp = await this.create({
    email: email.toLowerCase(),
    codeHash,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000),
  });
  return { otp, code };
};

otpSchema.methods.verify = async function (code) {
  if (this.verified) return false;
  if (new Date() > this.expiresAt) return false;
  const match = await bcrypt.compare(code, this.codeHash);
  if (match) {
    this.verified = true;
    await this.save();
  }
  return match;
};

export default mongoose.model('Otp', otpSchema);
