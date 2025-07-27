export interface AuditLog {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  action:
    | "CREATE"
    | "UPDATE"
    | "DELETE"
    | "LEND"
    | "RETURN"
    | "LOGIN"
    | "LOGOUT"
    | "RESET_PASSWORD"
    | "SEND_EMAIL";
  entity: string;
  entityId?: string; // If you're populating this in the future, consider a union type
  description?: string;
  timestamp: string; // ISO string (e.g., from new Date().toISOString())
}
