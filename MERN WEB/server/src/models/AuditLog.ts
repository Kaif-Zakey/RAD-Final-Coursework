import mongoose, { Schema, Document } from "mongoose";

export type AuditAction =
  | "CREATE"
  | "UPDATE"
  | "DELETE"
  | "LEND"
  | "RETURN"
  | "LOGIN"
  | "LOGOUT"
  | "RESET_PASSWORD"
  | "SEND_EMAIL"; // ✅ Add missing actions from frontend type

export interface IAuditLog extends Document {
  user: mongoose.Types.ObjectId; // will be populated
  action: AuditAction;
  entity: string;
  entityId?: mongoose.Types.ObjectId | string;
  description?: string;
  timestamp: Date;
}

const auditLogSchema = new Schema<IAuditLog>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      required: true,
      enum: [
        "CREATE",
        "UPDATE",
        "DELETE",
        "LEND",
        "RETURN",
        "LOGIN",
        "LOGOUT",
        "RESET_PASSWORD",
        "SEND_EMAIL",
      ],
    },
    entity: {
      type: String,
      required: true,
    },
    entityId: {
      type: Schema.Types.ObjectId,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  }
);

export const AuditLogModel = mongoose.model<IAuditLog>("AuditLog", auditLogSchema);
