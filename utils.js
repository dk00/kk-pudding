const fetch = require('node-fetch')

const machines = {
  'e8-west': '60474a49f9075f39bc72c52b5b348609',
  'e8-east': 'faa62cfd575a3de6d43098c0af1b4933',
  'kh-west': 'd714f0cd4123bde0a25b1a6adab930e3',
  'kh-east': '47ee91a0af98e749754f30cf7d756164',
  'h11-north': '3e9f1c51186faf024b97d8f712244c46',
  'h11-south-1': '1d2087a9025e6e25c4bf7718db71f223',
  'h11-south-2': '74d70ccb2cc19fdfdf0e6d541c5bec21',
}

const options = {
  key: process.env.YALLVEND_API_KEY,
}

const timeout = ms =>
  new Promise(resolve => {
    setTimeout(resolve, ms)
  })

const getStatus = ({vid}) =>
  fetch('https://pay.yallvend.com/epay/model/payment_api', {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      Referer: `https://pay.yallvend.com/kkcompany?vid=${vid}`,
    },
    body: `key=${options.key}&func=loadDefaultAmount&vidCode=${vid}`,
    method: 'POST',
  })
    .then(res => res.json())
    .then(q => {
      console.log(q)
      return q
    })
    .catch(e => {
      console.log(e)
      return Promise.reject(e)
    })

const waitStatus = async options =>
  Promise.any(
    Array.from({length: 6}, (_, i) =>
      timeout(i * 500)
        .then(() => getStatus(options))
        .then(data => (data.defaultAmount > 0 ? data : Promise.reject()))
    ).concat(timeout(6 * 500).then(() => ({defaultAmount: 1})))
  )

const dropPudding = async ({vid: vidParam, staffId}) => {
  const vid = machines[vidParam] || vidParam
  const data = {
    vid,
    staff_id: staffId,
    amount: (await waitStatus({vid})).defaultAmount,
    uuid: '111',
    haveAuth: false,
  }
  console.log(data)

  return fetch('https://pay.yallvend.com/epay/staff/staff.php', {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      Referer: `https://pay.yallvend.com/kkcompany?vid=${vid}`,
    },
    body: `data=${encodeURIComponent(JSON.stringify(data))}`,
  })
    .then(res => res.text())
    .then(result => {
      console.log(result)
      result
    })
}

export {dropPudding, machines}
