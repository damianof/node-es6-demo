'use strict';

let configs = {
	local: {
		httpServer: {
			proto: 'http',
			host: 'api.ddportal.dev',
			port: 3102,
			version: 'v1'
		},
		ddFeeder: {
			proto: 'http',
			host: 'www.ddfeeder.dev',
			port: 4102,
			version: 'v1'
		},
		logging: {
		    level: 'silly', // this will be the minimum level to log to the console
		    useFile: true, // if true it will also log to a file
		    fileLevel: 'error' // this will be the minimum level to log to the file
		},
		sockets: {
		    emit:   true,
		    port:   3102
		}
	},
	alpha: {
		
	},
	beta: {
		
	},
	production: {
		
	},
	common: {
		routes: {
			root: '/',
			echo:  '/echo/:name',
			chat: {
				message: '/chat/message'
			},
			admin: {
				portalUsers: '/admin/portalUsers'
				, portalUser: '/admin/portalUser'
				, portalUserModule: '/admin/portalUser/module'
				
				, portalPlans: '/admin/portalPlans'
				, portalPlan: '/admin/portalPlan'
				, portalPlanFeature: '/admin/portalPlan/feature'
			},
			user: {	
				registration: '/user/register/:applicationId'
				, getOneByUsername: '/user/:applicationId/:username'
				, getOneByTwitterName: '/user/:applicationId/twitter/:twitterName'
				, dashboard: '/dashboard/:applicationId/:username'
			}
		},
		// things common to all environment,
		emittedEvents: {
			queueFeederManager: {
				heartbeat: {key: 'queueFeederManager-heartbeat', interval: 1000}
				//, kpisHeartbeat: 'kpis-heartbeat'
			}
		},
		receivedEvents: {
			ddFeeder: {
				response: 'ddFeeder-response'
			},
			ddNLGEngine: {
				response: 'ddNLGEngine-response'
			},
			chat: {
				message: 'chat-message'
			},
			admin: {
				usersUpdated: 'users-updated'
				, plansUpdated: 'users-updated'
			}
		},
		amqpMessageTypes: {
			ddFeeder: {
				managerAction: 'manager-action'
				, allStatusesResponse: 'allStatuses-response'
			},
			ddNLGEngine: {
				managerAction: 'manager-action'
				, allStatusesResponse: 'allStatuses-response'
			},
			chat: {
				message: 'chat-message'
			}
		}
	}
};

let instance, baseUrl;

let setup = function(key){
	if (!instance){
		// select appropriate configuration based on the environment (key)
		let selected = configs[key];
		
		// check fo selected being null
		if (!selected){
			throw new Error('Missing configuration section for [' + key + ']');
		}

		selected.env = key;
		
		// add secret stuff
		// let secretStuff = require('./things/sec.js')[key];
		// selected.name = secretStuff.name;
		// selected.amqpConfig = secretStuff.amqpConfig;
		// selected.dbConfig = secretStuff.dbConfig;
		// selected.logging.fileName = secretStuff.name + '.log.txt';// log file
		
		// clone it
		instance = JSON.parse(JSON.stringify(selected));

		// add common stuff
		instance.common = JSON.parse(JSON.stringify(configs.common));
		
		// initial value for baseUrl
		baseUrl = instance.httpServer.proto + '://' + instance.httpServer.host;
		if (instance.httpServer.port && instance.httpServer.port != 80){
		 	baseUrl += ':' + instance.httpServer.port;
		}
		
		instance.setBaseUrl = function(url){
			if (!url || url.length < 10)
			{
				throw new Error ('setBaseUrl Exception. Url cannot be undefined or less than 10 char long');
			}
			
			baseUrl = url;
		};
		
		instance.getBaseUrl = function(){
			return baseUrl;
		};
	}
};

export function getInstance(key){
	if (!instance){
		setup(key);
	}
	return instance;
};
