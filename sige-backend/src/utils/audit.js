import { Audit } from "../models/Audit.js";

export const createAudit = async (user_id, action, table, record_id) => {
  try {
    await Audit.create({
      user_id,
      action,
      table,
      record_id
    });
  } catch (err) {
    console.error("Error registrando auditoría:", err.message);
  }
};
