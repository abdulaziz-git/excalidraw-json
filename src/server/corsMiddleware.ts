import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import Cors from 'cors';

const REGEX_PREFIX = 'regex:';

function getOrigins() {
  const origins = (process.env.EXCALIDRAW_ALLOWED_ORIGIN ?? '')
    .trim()
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)
    .map((origin) =>
      origin.startsWith(REGEX_PREFIX)
        ? new RegExp(origin.slice(REGEX_PREFIX.length))
        : origin,
    );

  return ["https://draw.qrku.net", ...origins];
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
    // console.log(cors);
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
          // console.log(resolve);
          resolve();
        },
      );
    });

    // console.log(req);
    // console.log(res);
    return fn(req, res);
  };
}
