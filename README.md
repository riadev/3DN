3DN
===

NodeJS based DNS+DHCP+Docker Management 

This is developped for a dev envirment service discovery purposes.

This currently support http restful api to update DNS record (a docker api client can send new vm info to it to register new vms) or Pull RouterOS dhcp Lease record.

#Installation
Server is wirtten in NODEJS. 

1. `git clone git@github.com:riadev/3DN.git`
2. run `npm install`

#Configuration
 Configuration is done through setting up envirment variables . simply run program with below bash statement as an example

 `EXPORT IP=192.168.1.2`

 `EXPORT PORT=80`

  check RUN section to see how you can run with

1. `IP` : This is the IP address the restful api http server and DNS server should be binded to. normally it should be *0.0.0.0* . but if you do want it to only listen to one interface, you would specify the IP address
2. `PORT`: HTTP Restful API TCP Port to listen on, defaut is *8080*
3. `DNS_PORT`: DNS UDP port to listen on, default is *53*
14. `ROS_TASK`: true or false to enable the routeros pulling job to poll from routeros's dhcp lease list(Note, with debian sqeeze machines, they don't register their hostname , you will have to apply some trick [http://jeffwelling.github.io/2010/01/02/Debian-dynamic-dns.html])
4. `ROS_HOST`: RouterOS's IP Addresss or hostname. default *localhost*
5. `ROS_USER`: RouterOS's API Username, default *admin*
6. `ROS_PASSWD`:RouterOS's API Password, default *password*
7. `SERVER_NAME`:Display purpose Server name, default value is 
8. `NODE_EVN`: Which mode you are running in, values can be production or test . if you do not specify this, it will be running in dev mode. Notice, if you do specify this to production, you need to have redis server avaiable and configure it 
9. `REDIS_HOST`: Only needed when NODE_EVN is production, host of redis server, default localhost
10. `REDIS_PORT`: Only needed when NODE_EVN is production, default 6379
11. `REDIS_OPS`: Only needed when NODE_EVN is production,default null
12. `REDIS_PASSWD`:Only needed when NODE_EVN is production, default null
13. `SCHEDULE_TASK`: true or false to indicate whether to enable internal scheduler to pull docker and dhcp server
#RUN
2. To simiply play with it  `npm start` or `node_modules/.bin/actionhero `
3. If you want to run it in background, install forever tool (`sudo npm install -g forever`)
	1. run `forever start node_modules/.bin/actionhero` 
	2. to check logs `forever logs 0` (assuming you are running this app only)
	3. `forever list` and `forever stop {index}` to stop other from running 
4. In order to run DNS server on UDP port 53, you will need to run with root permission. and your enviriment variables will need to be passed in following example `sudo  IP=0.0.0.0 PORT=80 DNS_PORT=53 ROS_HOST=0.0.0.0 ROS_USER=admin ROS_PASSWD=mypassword forever start node_modules/.bin/actionhero` Note that I am not listing all variables, you will have to list all your variables 

#Resful API
Documented at the index.html page. run the server and detailed documentation on API are shown there.

#Run with docker
```
docker run -d -p 80:8080 -p 53:8353/udp  --name=riadns --privileged=true --hostname=ns.yourdomain.net
 -e "BASE_DOMAIN=yourdomain.net"
 -e "DOCKER_HOSTS=docker1:4243,docker2:4243,docker3:4243"
 -e "DNS_PORT=8353"
 -e SCHEDULE_TASK=true
 -e IP="0.0.0.0"
 riadev/riadns
 ```

Now try
`
curl http://your_server.com/api/set_dns?apiVersion=1&name=test.domain.com&address=192.168.1.1&type=A&ttl=60
`

You should see json return
```
{
new: true
}
```
Indicating a new records has been added.

You can then use dig to query your dns server now
`
dig @your_server.com test.domain.com
`
You should be able to see IP address

We also support automatcially add PTR (Reverse DNS record for this) by appending *ptr=true* to parameter

`
curl http://your_server.com/api/set_dns?apiVersion=1&name=test.domain.com&address=192.168.1.1&type=A&ttl=60&auto_ptr=true
`

and

`
dig  @your_server.com 1.1.168.192.in-addr.arpa.
`

You can see the hostname comes back

`
;; ANSWER SECTION:
1.1.168.192.in-addr.arpa. 60	IN	PTR	test.domain.com.
`