exports.task = {
  name:          'ros_runner',
  description:   'ros_runner',
  frequency:     10*1000,
  queue:         'ros',
  plugins:       [],
  pluginOptions: {},
  
  run: function(api, params, next){
    if(process.env.ROS_TASK == "true" ){
      if(params == null){ params = {} }

      var task_connection = new api.connection({
        type: 'task',
        remotePort: '0',
        remoteIP: '0',
        rawConnection: {}
      });
      // params.action should be set
      task_connection.params = {"apiVersion":"1","ttl":15,"base_domain":process.env.BASE_DOMAIN,"action":"ros_dhcp_sync"};
      var actionProcessor = new api.actionProcessor({connection: task_connection, callback: function(connection, cont){
        if(connection.error){
          api.log('task error: ' + connection.error, 'error', {params: JSON.stringify(params)});
        } else {
          api.log('[ action @ task ]', 'debug', {params: JSON.stringify(params)});
        }

      }});
      actionProcessor.processAction();
    }else{
      api.log("Skipping ROS task","info");
    }
    next();
  }
};