import admin from 'firebase-admin';
import { db } from "../database.js";
export const deleteListingRoute = {
  method: 'DELETE',
  path: '/api/listings/{id}',
  handler: async (req, h) => {
    const token = req.headers.authtoken;
    const user = await admin.auth().verifyIdToken(token);
    const userId = user.user_id;
    const {
      id
    } = req.params;
    await db.query('DELETE FROM listings WHERE id=? AND user_id=?', [id, userId]);
    return {
      message: 'Success!'
    };
  }
};