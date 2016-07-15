// require external modules
var
    _ = require('lodash'),
    async = require('async'),
    pd = require('pretty-data').pd,
    request = require('request'),
    http = require('http'),
    soap = require('soap');

var AdWordsObject = require('../adWordsObject');

// define abstract AdWords service
function AdWordsService(options) {
  var self = this;
  AdWordsObject.call(self, options);

  _.defaults(self.options, {
    validateOnly: false
  });

  self.client = null;
  self.name = '';
  self.namespace = 'ns1';
  self.operatorKey = 'operator';
  self.validateOnly = self.options.validateOnly;
  
  self.setValidateOnly = function(flag) {
    self.validateOnly = flag;
    return self;
  };
  
  // Maintain order for keys in object, because in XML order matters
  self.matchJSONKeyOrder = function(src, toMatch) {
    var orderedObj = {};
    _.mapKeys(toMatch, function(v, k) {
      // Check and remove [] at the end
      if (typeof k !== 'string') return;
      if (k.substr(-2) === '[]')
        k = k.substr(0, k.length - 2);
      
      if (src[k] !== undefined)
        orderedObj[k] = src[k];
    });
    return orderedObj;
  };
  
  self.formGetRequest = function(selector) {
    var request = {};
    var getMethod = self.description[self.name][self.port].get;
    
    if (_.keys(getMethod.input).indexOf('selector') > -1) {
      request.selector = self.matchJSONKeyOrder(selector.toJSON(), getMethod.input.selector);
    } else if (_.keys(getMethod.input).indexOf('serviceSelector') > -1) {
      request.serviceSelector = self.matchJSONKeyOrder(selector.toJSON(), getMethod.input.serviceSelector);
    }
    
    return request;
  };

  self.getClient = function(done) {
    async.waterfall([
      // Get an active access token...
      function(cb) { self.refresh(cb); },
      
      // Create a SOAP client...
      function(cb) {
        if (self.client) {
          // Behave async
          setTimeout(function() { cb(null, self.client); }, 0);
          return;
        } else {
          soap.createClient(self.wsdlUrl, function(err, client) {
            self.client = client;

            // Add some event handling on the client
            self.client.on('request', function(request) {
              if (self.verbose)
                console.log('REQUEST: ', pd.xml(request), '\n');
            });

            self.client.on('response', function(response) {
              if (self.verbose)
                console.log('RESPONSE: ', pd.xml(response), '\n');
            });

            self.client.on('soapError', function(err) {
              if (self.verbose)
                console.log('SOAP ERROR: ', pd.xml(err.body), '\n');
            });

            // Grab some metadata out of the WSDL
            self.description = self.client.describe();
            self.name = _.keys(self.description)[0];
            self.port = _.keys(self.description[self.name])[0];
            self.methods = _.keys(self.description[self.name][self.port]);

            // Return the client or an error
            cb(err, self.client);
          });
          return;
        }
      }
    ], done);
  };
  
  self.parseErrorResponse = function(err) {
    // Format SOAP errors a bit better :)
    if (err.response instanceof http.IncomingMessage && err.response.body) {
      var parsedBody = err.response.body;
      if (parsedBody.indexOf('<faultstring') > -1)
        parsedBody = parsedBody.substring(parsedBody.lastIndexOf('<faultstring>') + '<faultstring>'.length, parsedBody.lastIndexOf('</faultstring>'));
      
      return Error({
        headers: err.response.headers,
        body: parsedBody,
        toString: function() {
          return parsedBody;
        }
      });
    }
    return err;
  };
  
  self.parseGetResponse = function(response) {
    throw new Error('parse get response not configured');
  };
  
  self.get = function(clientCustomerId, selector, done) {
    self.soapHeader.RequestHeader.clientCustomerId = clientCustomerId;

    async.waterfall([
      // get client
      self.getClient,
      
      // Request AdWords data...
      function(client, cb) {
        if (self.methods.indexOf('get') === -1) {
          return done(new Error('get method does not exist on ' + self.name));
        }

        self.client.addSoapHeader(
          self.soapHeader, self.name, self.namespace, self.xmlns
        );

        self.client.setSecurity(
          new soap.BearerSecurity(self.credentials.access_token)
        );

        self.client.get(self.formGetRequest(selector), cb);
      }
    ],
    function(err, response) {
      if (err) err = self.parseErrorResponse(err);
      
      return done(err, self.parseGetResponse(response));
    });
  };
  
  self.parseMutateResponse = function(response) {
    throw new Error('parse mutate response not configured');
  };

  self.mutate = function(options, done) {
    _.defaults(options, {
      parseMethod: self.parseMutateResponse
    });

    self.soapHeader.RequestHeader.clientCustomerId = options.clientCustomerId;

    async.waterfall([
      // get client
      self.getClient,
      
      // Request AdWords data...
      function(client, cb) {
        if (self.methods.indexOf('mutate') === -1) {
          return done(
            new Error('mutate method does not exist on ' + self.name)
          );
        }

        self.client.addSoapHeader(
          self.soapHeader, self.name, self.namespace, self.xmlns
        );

        self.client.setSecurity(
          new soap.BearerSecurity(self.credentials.access_token)
        );

        self.client[options.mutateMethod]({operations: options.operations}, cb);
      }
    ],
    function(err, response) {
      if (err) err = self.parseErrorResponse(err);
      
      return done(err, options.parseMethod(response));
    });
  };

  self.mutateAdd = function(clientCustomerId, operand, done) {
    if (!operand.isValid()) return done(operand.validationError);
    var operation = {};
    operation[self.operatorKey] = 'ADD';
    operation.operand = operand.toJSON();

    var options = {
      clientCustomerId: clientCustomerId,
      mutateMethod: 'mutate',
      operations: [operation]
    };

    self.mutate(options, done);
  };


  self.mutateAddCmNs = function(clientCustomerId, operand, done) {
    if (!operand.isValid()) return done(operand.validationError);
    var operation = {};
    var xmlns = 'https://adwords.google.com/api/adwords/cm/' + self.version;
    operation[self.operatorKey] = {
      attributes: { xmlns: xmlns },
      $xml: 'ADD'
    };
    operation.operand = operand.toJSON();

    var options = {
      clientCustomerId: clientCustomerId,
      mutateMethod: 'mutate',
      operations: [operation]
    };

    self.mutate(options, done);
  };

  self.mutateAddMultiple = function(clientCustomerId, operands, done) {
    // if (!operands.isValid()) return done(operand.validationError);
    var operations = [];
    async.each(operands, function(operand, cb) {
      operations.push({
        operator: 'ADD',
        operand: operand.toJSON()
      });
      cb();
    },
    function(err) {
      var options = {
        clientCustomerId: clientCustomerId,
        mutateMethod: 'mutate',
        operations: operations
      };
      self.mutate(options, done);
    });
  };

  self.mutateRemove = function(clientCustomerId, operand, done) {
    var operation = {};
    operation[self.operatorKey] = 'REMOVE';
    operation.operand = operand.toJSON();

    var options = {
      clientCustomerId: clientCustomerId,
      mutateMethod: 'mutate',
      operations: [operation]
    };

    self.mutate(options, done);
  };
  
  self.mutateRemoveMultiple = function(clientCustomerId, operands, done) {
    // if (!operands.isValid()) return done(operand.validationError);
    var operations = [];
    async.each(operands, function(operand, cb) {
      operations.push({
        operator: 'REMOVE',
        operand: operand.toJSON()
      });
      cb();
    },
    function(err) {
      var options = {
        clientCustomerId: clientCustomerId,
        mutateMethod: 'mutate',
        operations: operations
      };
      self.mutate(options, done);
    });
  };

  self.mutateSet = function(clientCustomerId, operand, done) {
    if (!operand.isValid()) return done(operand.validationError);
    var operation = {};
    operation[self.operatorKey] = 'SET';
    operation.operand = operand.toJSON();

    var options = {
      clientCustomerId: clientCustomerId,
      mutateMethod: 'mutate',
      operations: [operation]
    };

    self.mutate(options, done);
  };
  
  self.mutateSetMultiple = function(clientCustomerId, operands, done) {
    // if (!operands.isValid()) return done(operand.validationError);
    var operations = [];
    async.each(operands, function(operand, cb) {
      operations.push({
        operator: 'SET',
        operand: operand.toJSON()
      });
      cb();
    },
    function(err) {
      var options = {
        clientCustomerId: clientCustomerId,
        mutateMethod: 'mutate',
        operations: operations
      };
      self.mutate(options, done);
    });
  };

  self.parseQueryResponse = function(response) {
    throw new Error('parse query response not configured');
  };

  self.query = function(clientCustomerId, query, done) {
    self.soapHeader.RequestHeader.clientCustomerId = clientCustomerId;

    async.waterfall([
      // Get client
      self.getClient,
      
      // Request AdWords data...
      function(client, cb) {
        if (self.methods.indexOf('query') === -1) {
          return done(
            new Error('query method does not exist on ' + self.name)
          );
        }

        self.client.addSoapHeader(
          self.soapHeader, self.name, self.namespace, self.xmlns
        );

        self.client.setSecurity(
          new soap.BearerSecurity(self.credentials.access_token)
        );

        self.client.query({query: query}, cb);
      }
    ],
    function(err, response) {
      if (err) err = self.parseErrorResponse(err);
      
      return done(err, self.parseQueryResponse(response));
    });
  };

  self.soapHeader = {
    RequestHeader: {
      developerToken: self.options.ADWORDS_DEVELOPER_TOKEN,
      userAgent: self.options.ADWORDS_USER_AGENT,
      clientCustomerId: self.options.ADWORDS_CLIENT_CUSTOMER_ID,
      validateOnly: self.validateOnly
    }
  };
}

AdWordsService.prototype = _.create(AdWordsObject.prototype, {
  constructor: AdWordsService
});

module.exports = AdWordsService;
