import { Get, Msg, Route, Validate } from '@n3bula/express';

import type { ExpApiArgs } from '@n3bula/express';

@Route('')
export default class AuthApi {
  @Validate({ query: ['name'] })
  @Get('/ping')
  async isLoggedIn(...[req, res]: ExpApiArgs) {
    const user = (req as any).user;
    if (user) {
      res.status(200).send();
      return;
    }

    // res.status(200).send();
    return Msg.OK.loggedIn();
    // return Msg.OK.
  }
}
