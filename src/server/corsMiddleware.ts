import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import Cors from 'cors';

// const REGEX_PREFIX = 'regex:';

function getOrigins() {
  return ["draw.qrku.net","localhost:3000","http://localhost:3000","http://draw.qrku.net","https://draw.qrku.net"];
}

const cors = Cors({
  origin: getOrigins(),
  methods: ['GET', 'HEAD', 'POST'],
});

export function corsMiddleware<
  Request extends NextApiRequest = NextApiRequest,
  Response = any,
>(
  fn: (
    req: Request,
    res: NextApiResponse<Response>,
  ) => ReturnType<NextApiHandler>,
): (
  req: Request,
  res: NextApiResponse<Response>,
) => ReturnType<NextApiHandler> {
  return async (req, res) => {
    const origin = getOrigins();
    console.log(origin);
    await new Promise<void>((resolve, reject) => {
      cors(
        // @ts-ignore
        req,
        res,
        (result: Error) => {
          if (result) {
            console.log(result);
            return reject(result);
          }
          resolve();
        },
      );
    });

    return fn(req, res);
  };
}
