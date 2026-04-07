import { Get, Route } from '@/deco/routing';

import { Msg } from '@/util/msg';

import type { ExpRequest, ExpResponse } from '@/types';

@Route('/test')
export default class DefaultApi {
  @Get('')
  async handleGetNote(req: ExpRequest, _res: ExpResponse) {
    const query = req.query as Record<string, any>;

    // throw Msg.FAIL.apiKeyCreateFailed({
    //   test: 123
    // });

    return Msg.OK({ query });
  }
}
