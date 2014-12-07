var Docker = require('dockerode');

exports.task = {
  name:          'docker_runner',
  description:   'docker_runner',
  frequency:     10*1000,
  queue:         'docker',
  plugins:       [],
  pluginOptions: {},
  
  run: function(api, params, next){
    var host_string = process.env.DOCKER_HOSTS;
    if(host_string!=null){
      var hosts=host_string.split(",");

      add_record(hosts.pop());
      function add_record(host){
       var server_info=host.split(":");
       var docker = new Docker({host: server_info[0], port: server_info[1]});
        docker.listContainers(function (err, containers) {
          if(containers!=null){
            containers.forEach(function (containerInfo) {
              api.log("container:","debug",containerInfo)

              var id =  containerInfo.Id;
              var container = docker.getContainer(id);
              container.inspect(function(error,container_data){
                var domain_base=container_data.Config.Domainname||process.env.BASE_DOMAIN;
                var host=container_data.Config.Hostname;
                var ip=container_data.NetworkSettings.IPAddress;
                var record={name:host+"."+domain_base,address:ip, type:"A",ttl:10,auto_ptr:true}
                api.dns.put_record(record.name,record.address,record.type,record.ttl,function(error,is_new){
                  if(error === null )api.log("put dns record for docker:","debug",record)
                },record.auto_ptr);
              })

            });
          }
          if(hosts.length>0)
            add_record(hosts.pop());
          else
            next();
        });
      }

    }

  }
};
