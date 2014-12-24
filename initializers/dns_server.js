var dns = require('native-dns');
exports.dns_server = function(api, next){

  api.dns = {
    
    put_record:function(name,address,type,ttl,callback,auto_ptr){
      if(auto_ptr && type == "A"){
        var ptr=api.dns.get_ptr_from_a(address);
        api.cache.save(ptr,{name:ptr,data:name,type:"PTR",ttl:ttl},ttl*1000,function(error,is_new){
          if(error === null){
            api.cache.save(name,{name:name,address:address,type:type,ttl:ttl,auto_ptr:auto_ptr},ttl*1000,callback)
          }else{
            throw new Error("Error auto add ptr record");
          }
        });
      }else{
        api.cache.save(name,{name:name,address:address,type:type,ttl:ttl},ttl*1000,callback)
      }
    },
    get_record:function(name,callback){
      api.cache.load(name,function(error, value, expireTimestamp, createdAt, readAt){
        if(error === null && value != null){
          var current_timestamp=new Date().getTime();
          value.expireTimestamp=expireTimestamp;
          value.ttl_expire_in_sec=(expireTimestamp-current_timestamp)/1000;
          value.created_from_now_in_sec=(current_timestamp-createdAt)/1000;
          value.last_api_query_from_now_in_sec=(current_timestamp-readAt)/1000;
          callback(value);
        }else{
          callback(null);
        }
      })
    },
    
    get_ptr_from_a:function(address){
      var a_addr_segment=address.split(".");
      var ptr_addr_segment = [];
      for(var i = (a_addr_segment.length-1) ; i >= 0 ; i--){
        ptr_addr_segment.push(a_addr_segment[i]);
      }
      var ptr_addr = (ptr_addr_segment.join("."))+".in-addr.arpa";
      return ptr_addr;
    },

    bad_dns:["74.125.127.102", "74.125.155.102", "74.125.39.102", "74.125.39.113",
      "209.85.229.138",
      "128.121.126.139", "159.106.121.75", "169.132.13.103", "192.67.198.6",
      "202.106.1.2", "202.181.7.85", "203.161.230.171", "203.98.7.65",
      "207.12.88.98", "208.56.31.43", "209.145.54.50", "209.220.30.174",
      "209.36.73.33", "211.94.66.147", "213.169.251.35", "216.221.188.182",
      "216.234.179.13", "243.185.187.39", "37.61.54.158", "4.36.66.178",
      "46.82.174.68", "59.24.3.173", "64.33.88.161", "64.33.99.47",
      "64.66.163.251", "65.104.202.252", "65.160.219.113", "66.45.252.237",
      "72.14.205.104", "72.14.205.99", "78.16.49.15", "8.7.198.45", "93.46.8.89"]
    
  };

  api.dns._start = function(api, next){
    api.log("Staring native dns server .... ");
    api.log("Using external server","info",process.env.UPSTREAM_DNS||'219.239.26.42');
    var server = dns.createServer();
    server.on('request', function (request, response) {
      api.log("Serving request ","info",request.question[0]);
      
      api.dns.get_record(request.question[0].name,function(value){
        var answer = null;
        if(value != null){
          try{
            switch(value.type){
              case "A":
                answer = dns.A(value);
              break;
              case "PTR":
                answer = dns.PTR(value);
            }
            }catch(e){
              api.log("Error when creating DNS record","error",e)
            }
            response.answer.push(answer);
            response.send();
        }else{
          var question = dns.Question({
            name: request.question[0].name,
            type: 'A'
          });

          var req = dns.Request({
            question: question,
            server: { address: process.env.UPSTREAM_DNS||'219.239.26.42', port: 53, type: 'udp' },
            timeout: 1000
          });

          req.on('timeout', function () {
            api.log('Timeout in making request',"info");
            response.send();
          });
          req.on('message', function (err, answer) {
          var found_bad_addresss=false;
            answer.answer.forEach(function (a) {
              if(a.address == null) return;
              api.dns.bad_dns.forEach(function (b){
                if(found_bad_addresss || a.address == b){
                  found_bad_addresss=true;
                  return
                }
              });
            })
            if(found_bad_addresss){
              api.log("bad address returned!","info")
              return;
            }
            response.answer=answer.answer;
            response.send();
          });

          req.send();
        }

      })
      
    });
    
    server.on('error', function (err, buff, req, res) {
      api.log(err.stack,"error");
    });
    var binding_port=process.env.DNS_PORT||53;
    api.log("Binding on port "+ binding_port );
    server.serve(binding_port,(process.env.IP || '0.0.0.0'));

    next();
  };

  api.dns._stop =  function(api, next){
    next();
  };

  next();
}