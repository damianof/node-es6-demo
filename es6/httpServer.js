import * as restify from 'restify';
import * as httpServerConfig from './httpServerConfig.js';

let server, config;

if (!process.env.ENV) {
	process.env.ENV = 'local';
}

/**
 * @method setupConfig
 * @description
 * Setup config
 */
let setupConfig = function(){
	config = httpServerConfig.getInstance(process.env.ENV);
};

let configureRestify = function(){
	//logger.info('DDPortalAPI HttpServer configureRestify');
	
	// begin: configure Restify
	server = restify.createServer({
		name: 'DDPortalAPI',
		version: ['1.0.0']
	});
	
	server.pre(restify.CORS({
		origins: ['*'],  // defaults to ['*']
		credentials: false,
		headers: ['X-Requested-With', 'Authorization']
	}));
	
	server.pre(restify.fullResponse());
	
	server.use(restify.CORS());
	server.use(restify.fullResponse());
	server.use(restify.acceptParser(server.acceptable));
	server.use(restify.queryParser());
	server.use(restify.bodyParser());
	// end: configure Restify
};

export function start (){
	setupConfig();

	configureRestify();

	server.listen(config.httpServer.port, function(){
		console.log('HttpServer listening', {
			name: server.name
			, host: config.httpServer.host
			, port: config.httpServer.port
		});
		/*logger.info('HttpServer listening', {
			name: server.name
			, host: config.httpServer.host
			, port: config.httpServer.port
		});*/
		
		/*if (config.sockets.emit){
			logger.info('DDPortalAPI: HttpServer: starting socket io on port', config.sockets.port);
			require('./socketio/socketHttpServer.js').init(config, logger, eventEmitter, server);
		}*/
	});
};
