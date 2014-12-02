exports.set_dns = {
  name:                   'set_dns',
  description:            'Restful interface to set DNS record of this server. auto add ',
  blockedConnectionTypes: [],
  outputExample:          {},
  matchExtensionMimeType: false,
  version:                1.0,
  toDocument:             true,

  inputs: {
    required: ["name","address","type"],
    optional: ["ttl","auto_ptr"]
  },

  run: function(api, connection, next){
    var name= connection.params.name;
    var address= connection.params.address;
    var type= connection.params.type;
    var ttl=connection.params.ttl===null?5:connection.params.ttl;
    var auto_ptr=connection.params.auto_ptr===null?true:connection.params.auto_ptr;
    
    switch(type){
      case "A":
      case "PTR":
        api.dns.put_record(name,address,type,ttl,function(error,is_new){
          if(error === null )connection.response.new=is_new;
          next(connection, true);  
        },auto_ptr);
      break;
      default:
        connection.error="Currently only support type : A, PTR. Un supported type :"+type;
        next(connection, true);  
        
    }
    
  }
};

exports.get_dns = {
  name:                   'get_dns',
  description:            'Restful interface to get DNS record of this server',
  blockedConnectionTypes: [],
  outputExample:          {},
  matchExtensionMimeType: false,
  version:                1.0,
  toDocument:             true,

  inputs: {
    required: ["name"],
    optional: []
  },

  run: function(api, connection, next){
    var name= connection.params.name;
    
    api.dns.get_record(name,function(value){
      if( value!=null &&  value.type == "A" ){
        var ptr = api.dns.get_ptr_from_a(value.address);
        value.ptr=ptr; 
      }
      connection.response=value;
      next(connection, true);  
    });
    
  }
};