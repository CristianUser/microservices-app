import { Document, Model, model, Types, Schema } from 'mongoose';

// Schema
const RoleSchema = new Schema<RoleDocument, RoleModel>({
  name: {
    type: String,
    unique: true,
    required: true,
    lowercase: true
  },
  statements: {
    type: Array
  }
});

export interface Statement {
  effect: 'allow' | 'block' | 'ask'
  action: string;
  resource: string;
}

export interface Role {
  name: string;
  statements: Statement[]
}

/**
 * Not directly exported because it is not recommanded to
 * use this interface direct unless necessary since the
 * type of `company` field is not deterministic
 */
interface RoleBaseDocument extends Role, Document {
  friends: Types.Array<string>;
  creditCards?: Types.Map<string>;
  fullName: string;
  getGender(): string;
}

// Export this for strong typing
export interface RoleDocument extends RoleBaseDocument {}
// For model
export interface RoleModel extends Model<RoleDocument> {}

// Export this for strong typing
export interface RolePopulatedDocument extends RoleBaseDocument {}

// Default export
export default model<RoleDocument, RoleModel>('Role', RoleSchema);
