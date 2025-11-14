import { z } from 'zod';

// Reusable Zod schemas for common data types

/**
 * @summary Validates a foreign key (positive integer).
 */
export const zFK = z.coerce.number().int().positive();

/**
 * @summary Validates an optional/nullable foreign key.
 */
export const zNullableFK = z.coerce.number().int().positive().nullable();

/**
 * @summary Validates a standard name string (1-100 characters).
 */
export const zName = z
  .string()
  .min(1, 'Name is required')
  .max(100, 'Name must be 100 characters or less');

/**
 * @summary Validates a description string (max 500 characters).
 */
export const zDescription = z.string().max(500, 'Description must be 500 characters or less');

/**
 * @summary Validates an optional/nullable description string.
 */
export const zNullableDescription = z
  .string()
  .max(500, 'Description must be 500 characters or less')
  .nullable();

/**
 * @summary Validates a BIT type (0 or 1, coerced from boolean).
 */
export const zBit = z.boolean().transform((val) => (val ? 1 : 0));
