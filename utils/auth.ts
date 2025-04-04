import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends NextApiRequest {
  user?: { id: string; name: string; email: string }; // Replace with the actual user type
}

export const authenticate = (handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void> | void) => {
  return async (req: AuthenticatedRequest, res: NextApiResponse) => {
    const authHeader = req.headers.authorization;
    if(!authHeader){
      return res.status(401).json({ message: 'Không có token được cung cấp' });
    }

    const token = authHeader.split(' ')[1]; // Header dạng "Bearer token"
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
      req.user = decoded as { id: string; name: string; email: string };
      return handler(req, res);
    } catch(error){
      return res.status(401).json({ message: 'Token không hợp lệ', error: (error as Error).message });
    }
  }
};
