3DN
===

NodeJS based DNS+DHCP+Docker Management 

This is developped for a dev envirment service discovery purposes.

This currently support http restful api to update DNS record (a docker api client can send new vm info to it to register new vms) or Pull RouterOS dhcp Lease record.

#Installation
Server is wirtten in NODEJS. 

1. `git clone git@github.com:riadev/3DN.git`
2. run`npm install`

#Configuration
 
1. `IP` : This is the IP address the restful api http server and DNS server should be binded to. normally it should be *0.0.0.0* . but if you do want it to only listen to one interface, you would specify the IP address
2. `PORT`: HTTP Restful API TCP Port to listen on, defaut is *8080*
3. `DNS_PORT`: DNS UDP port to listen on, default is *53*
4. `ROS_HOST`: RouterOS's IP Addresss or hostname. default *localhost*
5. `ROS_USER`: RouterOS's API Username, default *admin*
6. `ROS_PASSWD`:RouterOS's API Password, default *password*
7. `SERVER_NAME`:Display purpose Server name, default value is 

#RUN
2. to simiply play with it  `npm start` or `node_modules/.bin/actionhero `
3. If you want to run it in background, use install forever(`sudo npm install -g forever`) 
	1. run `forever start node_modules/.bin/actionhero` 
	2. to check logs `forever logs 0` (assuming you are running this app only)
	3. `forever list` and `forever stop {index}` to stop other from running 
4. In order to run DNS server on UDP port 53, you will need to run with root permission. and your enviriment variables will need to be passed in following example `sudo  IP=0.0.0.0 PORT=80 DNS_PORT=53 ROS_HOST=0.0.0.0 ROS_USER=admin ROS_PASSWD=mypassword forever start node_modules/.bin/actionhero` Note that I am not listing all variables, you will have to list all your variables 

#Resful API
Documented at the index.html page. run the server and detailed documentation on API are shown there.
