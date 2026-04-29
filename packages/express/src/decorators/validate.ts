import { ZodError, z } from 'zod';

import { isArray } from '@n3bula/utils';

import { ValidateError } from '@/util/errors';

import { VALIDATE_HAS_WRAPPED } from '@/const';

import { assertsRouteMethodDecorator, isMultipleInvoke } from './utils';

import type { ZodNonOptional, ZodObject } from 'zod';
import type { ExpApiArgs, ExpRequest } from '@/types';
import type { MsgResult } from '@/util/msg';

type OnError = (error: any) => void;

export function Validate<
  BodySchema extends ZodObject,
  QuerySchema extends ZodObject,
>(
  data: { body?: string[] | BodySchema; query?: string[] | QuerySchema },
  onError?: OnError,
) {
  return <T extends (...args: ExpApiArgs) => Promise<MsgResult>>(
    originalMethod: T,
    context: ClassMethodDecoratorContext,
  ) => {
    context.addInitializer(() => {
      assertsRouteMethodDecorator(context, 'Validate');
    });

    if (isMultipleInvoke(context, VALIDATE_HAS_WRAPPED, 'Validate'))
      return originalMethod;

    return async function (this: any, ...[req, res, next]: Parameters<T>) {
      await Promise.all([
        checkSchema('body', req, data.body, onError),
        checkSchema('query', req, data.query, onError),
      ]);
      return originalMethod.call(this, req, res, next);
    };
  };
}

async function checkSchema<T extends ExpRequest>(
  key: 'body' | 'query',
  req: T,
  maybeSchema?: string[] | ZodObject,
  onError?: OnError,
) {
  if (!maybeSchema) return;
  let schema: ZodObject | null = null;
  if (isArray(maybeSchema)) {
    schema = z.object(
      maybeSchema.reduce(
        (obj, key) => {
          obj[key] = z.unknown().nonoptional();
          return obj;
        },
        {} as Record<string, ZodNonOptional>,
      ),
    );
  } else {
    schema = maybeSchema;
  }

  try {
    req[key] = await schema.parseAsync(req[key]);
  } catch (error: any) {
    if (onError) {
      onError(error);
      return;
    }
    if (error instanceof ZodError && error.issues.length) {
      const { path, message } = error.issues[0];
      throw new ValidateError(`${path.join('.')} ${message}`);
    }
  }
}
