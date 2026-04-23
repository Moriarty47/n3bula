import { Get, Route } from '@/deco/routing';

import { Msg } from '@/util/msg';

import type { ExpRequest, ExpResponse } from '@/types';

@Route('')
export default class AuthApi {
  @Get('/ping')
  async isLoggedIn(_req: ExpRequest, _res: ExpResponse) {
    return Msg.OK.loggedIn();
  }
}
