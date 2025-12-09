import { Msg } from '$util/msg';
import { Route, Get } from '$deco/routing';
import type { ExpRequest, ExpResponse } from '../types';

@Route('/test')
export default class DefaultApi {
  @Get('')
  async handleGetNote(req: ExpRequest, _res: ExpResponse) {
    const query = req.query as Record<string, any>;

    return Msg.SUCCESS({ query });
  }
}
