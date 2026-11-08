// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { RULES_URL } from '../../lib/rules'

//Returns the comprehensive rules .txt data at /api/ruleData
export default async function getInitialProps(req, res) {
  const response = await fetch(RULES_URL)
  res.send(await response.text());
}
