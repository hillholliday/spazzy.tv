// twitch
(function($){var REQUEST_TIMEOUT=5e3,HTTP_CODES={unauthorized:401},Twitch={$:$,baseUrl:"https://api.twitch.tv/kraken/",_config:{},extend:function(src){$.extend(Twitch,src)}};Twitch.api=function(options,callback){if(!Twitch._config.session)throw new Error("You must call init() before api()");var params=options.params||{};callback=callback||function(){};var authenticated=!!Twitch._config.session.token,url=Twitch.baseUrl+(options.url||options.method||"");authenticated&&(params.oauth_token=Twitch._config.session.token),options.verb&&(params._method=options.verb),$.ajax({url:url+"?"+$.param(params),dataType:"jsonp",timeout:REQUEST_TIMEOUT}).done(function(data){Twitch.log("Response Data:",data);if(!data||!data.error){callback(null,data||null);return}Twitch.log("API Error:",data.error+";",data.message),authenticated&&data.status===HTTP_CODES.unauthorized?Twitch.logout(function(){callback(data,null)}):callback(data,null)}).fail(function(){callback(new Error("Request Timeout"),null)})},Twitch.log=function(message){Array.prototype.unshift.call(arguments,"[Twitch]"),window.console&&console.log.apply(console,arguments)},window.Twitch=Twitch})(window.jQuery||window.Zepto),function(){var store=window.sessionStorage;store||function(){var Storage=function(type){function createCookie(name,value,days){var date,expires;days?(date=new Date,date.setTime(date.getTime()+days*24*60*60*1e3),expires="; expires="+date.toGMTString()):expires="",document.cookie=name+"="+value+expires+"; path=/"}function readCookie(name){var nameEQ=name+"=",ca=document.cookie.split(";"),i,c;for(i=0;i<ca.length;i++){c=ca[i];while(c.charAt(0)==" ")c=c.substring(1,c.length);if(c.indexOf(nameEQ)===0)return c.substring(nameEQ.length,c.length)}return null}function setData(data){data=JSON.stringify(data),type=="session"?window.name=data:createCookie("localStorage",data,365)}function clearData(){type=="session"?window.name="":createCookie("localStorage","",365)}function getData(){var data=type=="session"?window.name:readCookie("localStorage");return data?JSON.parse(data):{}}var data=getData();return{length:0,clear:function(){data={},this.length=0,clearData()},getItem:function(key){return data[key]===undefined?null:data[key]},key:function(i){var ctr=0;for(var k in data){if(ctr==i)return k;ctr++}return null},removeItem:function(key){delete data[key],this.length--,setData(data)},setItem:function(key,value){data[key]=value+"",this.length++,setData(data)}}};store=new Storage("session")}(),Twitch.extend({_storage:store})}(),function(){var init=function(options,callback){if(!options.clientId)throw new Error("client id not specified");Twitch._config.clientId=options.clientId,Twitch._initSession(),typeof callback=="function"&&Twitch.getStatus(callback)};Twitch.extend({init:init})}(),function(){var SESSION_KEY="twitch_oauth_session",$=Twitch.$,parseFragment=function(hash){var match,session;hash=hash||document.location.hash;var hashMatch=function(expr){var match=hash.match(expr);return match?match[1]:null};return session={token:hashMatch(/access_token=(\w+)/),scope:hashMatch(/scope=([\w+]+)/)?hashMatch(/scope=([\w+]+)/).split("+"):null,state:hashMatch(/state=(\w+)/),error:hashMatch(/error=(\w+)/),errorDescription:hashMatch(/error_description=(\w+)/)},session},updateSession=function(callback){Twitch.api({method:"/"},function(err,response){var session;if(err){Twitch.log("error encountered updating session:",err),callback&&callback(err,null);return}if(!response.token.valid){Twitch.logout(callback);return}callback&&callback(null,session)})},getToken=function(){return Twitch._config.session&&Twitch._config.session.token},getStatus=function(options,callback){typeof options=="function"&&(callback=options),typeof callback!="function"&&(callback=function(){});if(!Twitch._config.session)throw new Error("You must call init() before getStatus()");var makeSession=function(session){return{authenticated:!!session.token,token:session.token,scope:session.scope,error:session.error,errorDescription:session.errorDescription}};options&&options.force?updateSession(function(err,session){callback(err,makeSession(session||Twitch._config.session))}):callback(null,makeSession(Twitch._config.session))},login=function(options){if(!options.scope)throw new Error("Must specify list of requested scopes");var params={response_type:"token",client_id:Twitch._config.clientId,redirect_uri:options.redirect_uri||window.location.href.replace(/#.*$/,""),scope:options.scope.join(" ")};if(!params.client_id)throw new Error("You must call init() before login()");var url=Twitch.baseUrl+"oauth2/authorize?"+$.param(params);options.popup?Twitch._config.loginPopup=window.open(url,"Login with TwitchTV","height=600,width=660,resizable=yes,status=yes"):window.location=url},logout=function(callback){Twitch._config.session={},Twitch._storage.removeItem(SESSION_KEY),Twitch.events.emit("auth.logout"),typeof callback=="function"&&callback(null)},initSession=function(){var storedSession;Twitch._config.session={};if(window.JSON){storedSession=Twitch._storage.getItem(SESSION_KEY);if(storedSession)try{Twitch._config.session=JSON.parse(storedSession)}catch(e){}}document.location.hash.match(/access_token=(\w+)/)&&(Twitch._config.session=parseFragment(),window.JSON&&Twitch._storage.setItem(SESSION_KEY,JSON.stringify(Twitch._config.session))),getStatus(function(err,status){status.authenticated&&Twitch.events.emit("auth.login")})};Twitch.extend({_initSession:initSession,_parseFragment:parseFragment,getToken:getToken,getStatus:getStatus,login:login,logout:logout})}(),function(){function EventEmitter(){this._events={},this._maxListeners=10}function Event(type,listener,scope,once,instance){this.type=type,this.listener=listener,this.scope=scope,this.once=once,this.instance=instance}Event.prototype.fire=function(args){this.listener.apply(this.scope||this.instance,args);if(this.once)return this.instance.removeListener(this.type,this.listener,this.scope),!1},EventEmitter.prototype.eachListener=function(type,callback){var i=null,possibleListeners=null,result=null;if(this._events.hasOwnProperty(type)){possibleListeners=this._events[type];for(i=0;i<possibleListeners.length;i+=1){result=callback.call(this,possibleListeners[i],i);if(result===!1)i-=1;else if(result===!0)break}}return this},EventEmitter.prototype.addListener=function(type,listener,scope,once){return this._events.hasOwnProperty(type)||(this._events[type]=[]),this._events[type].push(new Event(type,listener,scope,once,this)),this.emit("newListener",type,listener,scope,once),this._maxListeners&&!this._events[type].warned&&this._events[type].length>this._maxListeners&&(Twitch.log("Possible EventEmitter memory leak detected. "+this._events[type].length+" listeners added. Use emitter.setMaxListeners() to increase limit."),this._events[type].warned=!0),this},EventEmitter.prototype.on=EventEmitter.prototype.addListener,EventEmitter.prototype.once=function(type,listener,scope){return this.addListener(type,listener,scope,!0)},EventEmitter.prototype.removeListener=function(type,listener,scope){return this.eachListener(type,function(currentListener,index){currentListener.listener===listener&&(!scope||currentListener.scope===scope)&&this._events[type].splice(index,1)}),this._events[type]&&this._events[type].length===0&&delete this._events[type],this},EventEmitter.prototype.off=EventEmitter.prototype.removeListener,EventEmitter.prototype.removeAllListeners=function(type){return type&&this._events.hasOwnProperty(type)?delete this._events[type]:type||(this._events={}),this},EventEmitter.prototype.listeners=function(type){if(this._events.hasOwnProperty(type)){var listeners=[];return this.eachListener(type,function(evt){listeners.push(evt.listener)}),listeners}return[]},EventEmitter.prototype.emit=function(type){var args=[],i=null;for(i=1;i<arguments.length;i+=1)args.push(arguments[i]);return this.eachListener(type,function(currentListener){return currentListener.fire(args)}),this},EventEmitter.prototype.setMaxListeners=function(maxListeners){return this._maxListeners=maxListeners,this},Twitch.extend({events:new EventEmitter})}();