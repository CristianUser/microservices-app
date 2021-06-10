const express = require('express');

const router = express.Router();

const speakersRoute = require('./speakers');

export default (param: any) => {
  const { speakers } = param;

  router.get('/', async (req: any, res: any, next: any) => {
    try {
      const promises = [];
      promises.push(speakers.getListShort());
      promises.push(speakers.getAllArtwork());

      const results = await Promise.all(promises);

      return res.render('index', {
        page: 'Home',
        speakerslist: results[0],
        artwork: results[1],
      });
    } catch (err) {
      return next(err);
    }
  });

  router.use('/speakers', speakersRoute(param));

  return router;
};
