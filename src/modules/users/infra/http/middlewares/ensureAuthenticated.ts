import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import authConfig from '@config/auth';
import AppError from '@shared/errors/AppError';

export interface TokenPayload {
  iat: number;
  establishment_id: number;
  shop_id: number;
  exp: number;
  sub: string;
}

export default function (
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError('JWT token is missing', 401);
  }

  const [, token] = authHeader.split(' ');
  try {
    const decoded = verify(token, authConfig.jwt.secret);

    const { sub, establishment_id, shop_id } = decoded as TokenPayload;

    request.user = {
      id: Number(sub),
      establishment_id,
      shop_id,
    };

    return next();
  } catch {
    throw new AppError('Invalid JWT Token', 401);
  }
}
