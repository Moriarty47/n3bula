import { Get, Route } from '@n3bula/express';

import type { ExpRequest, ExpResponse } from '@n3bula/express';

@Route('')
export default class AuthApi {
  @Get('/ping')
  async isLoggedIn(req: ExpRequest, res: ExpResponse) {
    const user = (req as any).user;
    if (user) {
      res.status(200).send();
      return;
    }

    res.status(401).send();
    // return Msg.OK.loggedIn();
    // return Msg.OK.
  }
}
