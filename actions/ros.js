var rosapi = require('mikronode');

var run_ros_cmd=function(cmd_callback,path,api){
  var ros_params=
              {
                host:process.env.ROS_HOST||'localhost',
                user:process.env.ROS_USER||'admin',
                password:process.env.ROS_PASSWD||'password'
              }
  //api.log("roueros start parameter:","info",ros_params);           
  var ros_conn = new rosapi(ros_params.host,ros_params.user,ros_params.password);
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
        console.info("issue query:"+path);
        chan.write(path,function() {
            chan.on('done',function(data) {
                var parsed = rosapi.parseItems(data);
                chan.close();
                conn_obj.close();
                cmd_callback(parsed)
            });
        });
      }
}
   
exports.ros_run_cmd = {
  name:                   'ros_run_cmd',
  description:            'run the routeros command line with a path paramerter. i.e. /ip/dns/static/print or /ip/dns/static/edit ****',
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

  run: function(api, connection, next){
      run_ros_cmd(function(value){
        connection.response=value;
        next(connection,true)
      },connection.params.path
      ,api)
  }
};

exports.ros_dhcp_sync = {
  name:                   'ros_dhcp_sync',
  description:            'Restful interface to set DNS auto add dhcp record to DNS record ',
  blockedConnectionTypes: [],
  outputExample:          {},
  matchExtensionMimeType: false,
  version:                1.0,
  toDocument:             true,

  inputs: {
    required: ["base_domain"],
    optional: ["ttl"]
  },

  run: function(api, connection, next){
    var base_domain = connection.params.base_domain;
    var user_ttl = connection.params.ttl || 30;
    connection.response=[];
    
    run_ros_cmd(function(value){
      add_record(value);  
    },"/ip/dhcp-server/lease/print",api)
    var counter=0;
    var add_record=function(records){
      if(records.length>0){
        var record = records.pop();
        if(record["host-name"] === null || record["host-name"] === undefined){
          //skip adding and jump to next
          add_record(records);
          return;
        }
        counter++;
        var name= record["host-name"].toLowerCase()+"."+record["server"].toLowerCase()+"."+base_domain.toLowerCase();
        var address= record["address"] || record["active-address"];
        var type= "A";
        var ttl=user_ttl;
        var auto_ptr=true;
        api.dns.put_record(name,address,type,ttl,function(error,is_new){
          if(error === null )connection.response.push({name:name,address:address,type:type,ttl:ttl,is_new:is_new});
          add_record(records);
        },auto_ptr);
      }else{
        api.log("processed "+counter +" record","info")
        next(connection, true);
      }
      
    }
  }
};
