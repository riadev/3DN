var dns = require('native-dns');
exports.dns_server = function(api, next){

  api.dns = {
    
    put_record:function(name,address,type,ttl,callback,auto_ptr){
      if(auto_ptr && type == "A"){
        var ptr=api.dns.get_ptr_from_a(address);
        api.cache.save(name,{name:ptr,address:name,type:"PTR",ttl:ttl},ttl*1000,function(error,is_new){
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
    }
    
  };

  api.dns._start = function(api, next){
    api.log("Staring native dns server .... ");
    
    var server = dns.createServer();
    server.on('request', function (request, response) {
      api.log("Serving request ",0,request.question[0].name);
      
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
        }
      response.send();
      })
      
    });
    
    server.on('error', function (err, buff, req, res) {
      api.log(err.stack,"error");
    });
    var binding_port=api.config.general.dnsport||53;
    api.log("Binding on port "+ binding_port );
    server.serve(binding_port,(process.env.IP || '0.0.0.0'));

    next();
  };

  api.dns._stop =  function(api, next){
    next();
  };

  next();
}