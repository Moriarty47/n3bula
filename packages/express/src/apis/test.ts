import { z } from 'zod';

import { Get } from '@/deco/methods';
import { Route } from '@/deco/route';
import { Validate } from '@/deco/validate';
import { timeoutMw } from '@/mw/timeout';

import { Msg } from '@/util/msg';

import type { ExpApiArgs } from '@/types';

const BodySchema = z.object({
  // test: z.object({
  //   a: z.string().min(1),
  // }),
  test: z.string().min(10),
});

@Route('/auth')
export default class AuthApi {
  @Validate({ query: BodySchema }, error => {
    console.log(error);
        
  })
  // @Validate({ body: ['test'] })
  @Get('/ping')
  async isLoggedIn(
    ...[req, _res, _next]: ExpApiArgs<z.infer<typeof BodySchema>>
  ) {
    // @ts-ignore
    const { test } = req.body;
    // assertsRequired(test, 'test', '[test] is required');

    return Msg.OK.loggedIn();
  }

  @Validate({ body: BodySchema })
  @Get('/ping1', timeoutMw({ reqTimeout: 30 * 1000 }))
  async isLoggedIn1(...[_req, _res]: ExpApiArgs) {
    // @ts-ignore
    const { test } = _req.body as { test?: string };
    // assertsRequired(test, 'test', '[test] is required');

    return Msg.OK.loggedIn();
  }
}
