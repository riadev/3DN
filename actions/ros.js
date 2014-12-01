var rosapi = require('mikronode');

   
exports.action = {
  name:                   'ros',
  description:            'ros',
  blockedConnectionTypes: [],
  outputExample:          {},
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