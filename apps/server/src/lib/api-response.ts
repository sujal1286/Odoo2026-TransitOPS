import type { Context } from "hono";

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code: string;
    details?: any;
  };
}

/**
 * Standard success response wrapper
 */
export const successResponse = <T>(c: Context, data: T, status: number = 200) => {
  const body: ApiResponse<T> = {
    success: true,
    data,
  };
  return c.json(body, status as any);
};

/**
 * Standard error response wrapper
 */
export const errorResponse = (
  c: Context,
  message: string,
  code: string = "INTERNAL_ERROR",
  status: number = 500,
  details?: any
) => {
  const body: ApiResponse = {
    success: false,
    error: {
      message,
      code,
      details,
    },
  };
  return c.json(body, status as any);
};
