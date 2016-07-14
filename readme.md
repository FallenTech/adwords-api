[![Build Status](https://travis-ci.org/FallenTech/adwords-api.svg?branch=master)](https://travis-ci.org/FallenTech/adwords-api)
[![NPM version](https://badge.fury.io/js/adwords-api.svg)](http://badge.fury.io/js/adwords-api)

[![NPM stats](https://nodei.co/npm/adwords-api.svg?downloads=true)](https://www.npmjs.org/package/mongoose-url-slugs)

# Google AdWords API

An unofficial SDK for Google AdWords API

## Installation

```bash
npm install adwords-api
```

## Getting your Google AdWords access and refresh tokens
Start by following the instructions at [https://developers.google.com/adwords/api/docs/guides/start](https://developers.google.com/adwords/api/docs/guides/start).  You will need client ID, a client secret, and an authorization code.  You will get the client ID and the client secret from the Google Developers Console.  To get an authorization code (filling in client_id and selecting account), open this URL in your browser:

```
https://accounts.google.com/o/oauth2/auth?client_id=<CLIENT_ID>&response_type=code&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fadwords&redirect_uri=urn:ietf:wg:oauth:2.0:oob&access_type=offline&approval_prompt=auto
```

Use this code to get tokens (filling in your Google AdWords credentials):

```bash
curl \
  -d code=<AUTHORIZATION_CODE> \
  -d client_id=<CLIENT_ID> \
  -d client_secret=<CLIENT_SECRET> \
  -d redirect_uri=urn:ietf:wg:oauth:2.0:oob \
  -d grant_type=authorization_code https://accounts.google.com/o/oauth2/token
```

This yields something like:

```JSON
{
  "access_token" : <ACCESS_TOKEN>,
  "token_type" : "Bearer",
  "expires_in" : 3599,
  "refresh_token" : <REFRESH_TOKEN>
}
```

Use the `access_token` to make requests.  The `access_token` will expire.  Use the `refresh_token` to get a new access token.  The `refresh_token` will not expire. The `refresh_token` is a stored credential.

## Authentication
This library's services get Google AdWords credentials from the following sources in priority order:
- From passed in options values:

```javascript
var AdWords = require('adwords-api');

var Service = new AdWords.ManagedCustomerService({
  ADWORDS_CLIENT_ID: 'your client id',
  ADWORDS_CLIENT_CUSTOMER_ID: 'your client customer id',
  ADWORDS_DEVELOPER_TOKEN: 'your developer token'
  ADWORDS_REFRESH_TOKEN: 'your refresh token',
  ADWORDS_SECRET: 'your secret',
  ADWORDS_USER_AGENT: 'your user agent',
});
```

- Via environment variables which are either present or loaded via a `.env` file.  An example `.env` file is provided in `.env-example`.

Failure to provide credentials will cause the library to throw a configuration error.

## Using the library
Here are some examples.  Documentation should improve, but in the mean time, the best places to look are the [integration tests](./tests/integration) and the [gulp tasks](./gulp).

### AdGroupService
Setting up the AdGroupService:

```javascript
var AdWords = require('adwords-api');
var service = new AdWords.AdGroupService();
var clientCustomerId = 'the client customer ID you are interested in';
```

Getting AdGroups:

```javascript
var selector = new AdWords.Selector.model({
  fields: service.selectable,
  ordering: [{field: 'Name', sortOrder: 'ASCENDING'}],
  paging: {startIndex: 0, numberResults: 100}
});

service.get(clientCustomerId, selector, function(err, results) {
  if (err) console.log(err);
  else console.log(JSON.stringify(results, null, 2));
});
```

### AccountLabelService
Setting up the AccountLabelService:

```javascript
var AdWords = require('adwords-api');
var service = new AdWords.AccountLabelService();
var clientCustomerId = 'the client customer ID you are interested in';
```

Getting account labels:

```javascript
var selector = new AdWords.Selector.model({
  fields: service.selectable,
  ordering: [{field: 'Name', sortOrder: 'ASCENDING'}],
  paging: {startIndex: 0, numberResults: 100}
});

service.get(clientCustomerId, selector, function(err, results) {
  if (err) console.log(err);
  else console.log(JSON.stringify(results, null, 2));
});
```

Adding an account label:

```javascript
var operand = new service.Model({
  name: 'the name of the account label'
});

service.mutateAdd(
  clientCustomerId,
  operand,
  function(err, results) {
    if (err) console.log(err);
    else console.log(JSON.stringify(results, null, 2));
  }
);
```

Removing an account label:

```javascript
var operand = new service.Model({
  id: 'the id of the account label'
});

service.mutateRemove(
  clientCustomerId,
  operand,
  function(err, results) {
    if (err) console.log(err);
    else console.log(JSON.stringify(results, null, 2));
  }
);
```

Changing the name of an account label:

```javascript
var operand = new service.Model({
  id: 'the id of the account label',
  name: 'the new name of the account label'
});

service.mutateSet(
  clientCustomerId,
  operand,
  function(err, results) {
    if (err) console.log(err);
    else console.log(JSON.stringify(results, null, 2));
  }
);
```

### CampaignService
Setting up the CampaignService:

```javascript
var AdWords = require('adwords-api');
var service = new AdWords.CampaignService();
var clientCustomerId = 'the client customer ID you are interested in';
```

Getting your campaigns:

```javascript
var selector = new AdWords.Selector.model({
  dateRange: {min: '19700101', max: '20380101'},
  fields: service.selectable,
  ordering: [{field: 'Name', sortOrder: 'ASCENDING'}],
  paging: {startIndex: 0, numberResults: 100},
  predicates: []
});

service.get(clientCustomerId, selector, function(err, results) {
  if (err) console.log(err);
  else console.log(JSON.stringify(results, null, 2));
});
```

### ManagedCustomerService
Setting up the ManagedCustomerService:

```javascript
var AdWords = require('adwords-api');
var service = new AdWords.ManagedCustomerService();
var clientCustomerId = 'the client customer ID you are interested in';
```

Getting your managed customers:

```javascript
var selector = new AdWords.Selector.model({
  dateRange: {min: '19700101', max: '20380101'},
  fields: service.selectable,
  ordering: [{field: 'Name', sortOrder: 'ASCENDING'}],
  paging: {startIndex: 0, numberResults: 100},
  predicates: []
});

service.get(clientCustomerId, selector, function(err, results) {
  if (err) console.log(err);
  else console.log(JSON.stringify(results, null, 2));
});
```

Adding a managed customer:

```javascript
var operand = new service.Model({
  name: 'the name of the customer',
  currencyCode: 'USD',
  dateTimeZone: 'America/Chicago'
});

service.mutateAdd(
  clientCustomerId,
  operand,
  function(err, results) {
    if (err) console.log(err);
    else console.log(JSON.stringify(results, null, 2));
  }
);
```

Hiding a managed customer:

```javascript
var operand = new service.ManagedCustomerLink({
  clientCustomerId: clientCustomerId,
  isHidden: true,
  managerCustomerId: managerCustomerId
});

service.mutateLinkSet(
  clientCustomerId,
  operand,
  function(err, results) {
    if (err) console.log(err);
    else console.log(JSON.stringify(results, null, 2));
    cb(err);
  }
);
```

## Credits
[Erik Evenson](https://github.com/ErikEvenson) (Base Code)

## License

The MIT License (MIT)

Copyright (c) 2016 Talha Asad

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.