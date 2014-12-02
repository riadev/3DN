var rosapi = require('mikronode');

   
exports.action = {
  name:                   'ros',
  description:            'ros',
  blockedConnectionTypes: [],
  outputExample:          
    [
       {
        ".id": "*2A5C",
        "address": "192.168.6.95",
        "mac-address": "B8:88:E3:39:EF:E6",
        "client-id": "1:b8:88:e3:39:ef:e6",
        "server": "User",
        "always-broadcast": "true",
        "status": "bound",
        "expires-after": "14:40:26",
        "last-seen": "8h19m34s",
        "active-address": "192.168.6.95",
        "active-mac-address": "B8:88:E3:39:EF:E6",
        "active-client-id": "1:b8:88:e3:39:ef:e6",
        "active-server": "User",
        "host-name": "cc-PC",
        "radius": "false",
        "dynamic": "true",
        "blocked": "false",
        "disabled": "false"
      },
      {
        ".id": "*2A5D",
        "address": "192.168.6.94",
        "mac-address": "28:D2:44:68:2C:5E",
        "client-id": "1:28:d2:44:68:2c:5e",
        "server": "User",
        "status": "bound",
        "expires-after": "06:36:57",
        "last-seen": "7h20m10s",
        "active-address": "192.168.6.94",
        "active-mac-address": "28:D2:44:68:2C:5E",
        "active-client-id": "1:28:d2:44:68:2c:5e",
        "active-server": "User",
        "host-name": "HuangPC",
        "radius": "false",
        "dynamic": "true",
        "blocked": "false",
        "disabled": "false"
      }
    ]
    
  ,
  matchExtensionMimeType: false,
  version:                1.0,
  toDocument:             true,

  inputs: {
    required: ['path'],
    optional: []
  },

  run: function(api, ah_connection, next){
    //console.log(api.config.general.action_timeout)
    //setTimeout(function() {next(ah_connection, true);}, api.config.general.action_timeout);
      var ros_conn = new rosapi('124.193.211.117','admin','f1zzb4ck');
      var conn_obj=null;
      
      if(conn_obj === null || !ros_conn.isConnected){
        console.info("no connection, establish connection first");
        make_connection(make_query)
      }else{
        console.info("connection exist, make query directl");
        make_query
      }
      
      
      function make_connection(callback){
        ros_conn.connect(function(conn) {
           conn_obj=conn;
           console.info("RouterOS Connected");
           callback();
        })
      }
      
      
    
      
      function make_query(){
        var chan=conn_obj.openChannel();
        console.info("issue query:"+ah_connection.params.path);
        chan.write(ah_connection.params.path,function() {
           chan.on('done',function(data) {
    
              var parsed = rosapi.parseItems(data);
    
              // parsed.forEach(function(item) {
              //   console.log(JSON.stringify(item));
              // });
              
              ah_connection.response=parsed;
              next(ah_connection, true);
  
              chan.close();
              conn_obj.close();
    
           });
       
        });
      }
      
  }
};