import { Request, Response, NextFunction } from 'express';
import { authenticate, authorize, AuthenticatedRequest } from '../middleware/auth';
import jwt from 'jsonwebtoken';

jest.mock('jsonwebtoken');

describe('Auth Middleware', () => {
  let req: Partial<AuthenticatedRequest>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      headers: {},
      cookies: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  test('should return 401 if no access token is provided', () => {
    authenticate(req as AuthenticatedRequest, res as Response, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: 'Access token required' })
    );
    expect(next).not.toHaveBeenCalled();
  });

  test('should authenticate request and populate req.user if token is valid', () => {
    req.headers!.authorization = 'Bearer valid-jwt-token';
    const mockPayload = { id: 'user-123', email: 'user@test.com', role: 'user' };
    (jwt.verify as jest.Mock).mockReturnValue(mockPayload);

    authenticate(req as AuthenticatedRequest, res as Response, next);

    expect(jwt.verify).toHaveBeenCalled();
    expect(req.user).toEqual(mockPayload);
    expect(next).toHaveBeenCalled();
  });

  test('should deny access if user role is not allowed', () => {
    req.user = { id: 'user-123', email: 'user@test.com', role: 'user' };
    const checkRole = authorize(['admin']);

    checkRole(req as AuthenticatedRequest, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: 'Access denied: insufficient permissions' })
    );
    expect(next).not.toHaveBeenCalled();
  });

  test('should grant access if user role is allowed', () => {
    req.user = { id: 'admin-123', email: 'admin@test.com', role: 'admin' };
    const checkRole = authorize(['admin']);

    checkRole(req as AuthenticatedRequest, res as Response, next);

    expect(next).toHaveBeenCalled();
  });
});
