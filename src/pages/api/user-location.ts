import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

const handler: NextApiHandler = function (req, res) {
  switch (req.method) {
    case 'POST':
      console.log('Mapbox response in API route', req.body);
      res.json({ 'Mapbox response in API route': req.body });
  }
};
export default handler;
