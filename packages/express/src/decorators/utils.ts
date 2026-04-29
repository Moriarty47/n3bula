import { logger } from '@/util/log';

import { ROUTE_CLASS } from '@/const';

export const isMultipleInvoke = (
  context: ClassMethodDecoratorContext | ClassDecoratorContext,
  symbolKey: symbol,
  decoratorName: string,
) => {
  const metadata = context.metadata as Record<
    symbol,
    Set<string | symbol | undefined>
  >;
  if (!metadata) return false;

  metadata[symbolKey] ||= new Set();

  if (metadata[symbolKey].has(context.name)) {
    logger.warn(
      `@${decoratorName} invoked on ${String(context.name)} multiple times, skiped`,
    );
    return true;
  }

  metadata[symbolKey].add(context.name);
  return false;
};

export function assertsRouteMethodDecorator(
  context: ClassMethodDecoratorContext,
  decoratorName: string,
): asserts context is ClassMethodDecoratorContext {
  if (context.kind !== 'method' || !context.metadata[ROUTE_CLASS]) {
    const error = new TypeError(
      `@${decoratorName} can only be used for methods that decorated by @Route`,
    );
    logger.error(error);
    process.exit(1);
  }
}
