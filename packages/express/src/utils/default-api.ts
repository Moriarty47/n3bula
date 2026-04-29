import { Get } from '@/deco/methods';
import { Route } from '@/deco/route';

import { Msg } from '@/util/msg';

import type { ExpApiArgs } from '@/types';

@Route('')
export default class DefaultApi {
  @Get('/ping')
  async handleGetNote(...[req, _res]: ExpApiArgs) {
    const query = req.query as Record<string, any>;

    // throw Msg.FAIL.apiKeyCreateFailed({
    //   test: 123
    // });

    return Msg.OK({ query });
  }
}
