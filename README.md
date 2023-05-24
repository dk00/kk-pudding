# KK Pudding

## Endpoints

- `https://pudding-delta.vercel.app/api/pudding?vid=<machine-alias>&staffId=<your-staff-id>`

## Reverse Engineering

API doesn't provide CORS headers, a proxy is required to get result of the API.

It poll status every `3` seconds:

```js
fetch("https://pay.yallvend.com/epay/model/payment_api", {
  "headers": {
  },
  "body": "key=<api-key>&func=loadDefaultAmount&vidCode=<machine-id>",
  "method": "POST",
});
```

response(no selection): 

```json
{"status":200,"defaultAmount":0,"amountCh":"0"}
```

response(selected):

```json
{"status":200,"defaultAmount":15,"amountCh":"11"}
```

If submit before the status is updated, it displays error and do nothing.

It's possible to customize the UI since there's kkcompany specific page, but it may take ages to be done...

**Actual Pay API**

Working code snippet to drop a drink:

```js
const data = {
  vid: '<machine-id>', // last part of QR code URL, every machine has its own
  staff_id: 'your-staff-id',
  amount: '15', // must match the number displayed on the machine
  uuid: '111',
  haveAuth: false,
}

fetch('https://pay.yallvend.com/epay/staff/staff.php', {
  method: 'POST',
  headers: {
    'content-type': 'application/x-www-form-urlencoded',
  },
  body: `data=${encodeURIComponent(JSON.stringify(data))}`,
})
  .then(it => it.json())
  .then(result => console.log(result))
```


If pay with a non existing staff id:

```js
{status: 'fail', statusCode: 400, error: '未知錯誤 105'}
```

**Machines**

| Location                                                                           | vid                              |
| ---------------------------------------------------------------------------------- | -------------------------------- |
| [E8 West](https://pay.yallvend.com/kkcompany?vid=60474a49f9075f39bc72c52b5b348609) | 60474a49f9075f39bc72c52b5b348609 |
| [E8 East](https://pay.yallvend.com/kkcompany?vid=faa62cfd575a3de6d43098c0af1b4933) | faa62cfd575a3de6d43098c0af1b4933 |
| [KH East](https://pay.yallvend.com/kkcompany?vid=47ee91a0af98e749754f30cf7d756164) | 47ee91a0af98e749754f30cf7d756164 |
| [KH West](https://pay.yallvend.com/kkcompany?vid=d714f0cd4123bde0a25b1a6adab930e3) | d714f0cd4123bde0a25b1a6adab930e3 |

