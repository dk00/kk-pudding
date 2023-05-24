import {dropPudding} from '../utils'

export default async (req, res) => {
  res.json({
    result: await dropPudding(req.query).catch(err => {
      res.status(500)
      return err
    }),
  })
}
