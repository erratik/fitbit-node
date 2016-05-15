var OAuth2 = require('simple-oauth2'),
    Q = require('q'),
    Request = require('request');

function FitbitApiClient(data) {
    this.oauth2 = OAuth2({
        clientID: data.clientID,
        clientSecret: data.clientSecret,
        site: 'https://api.fitbit.com/', 
        authorizationPath: 'oauth2/authorize',
        tokenPath: 'oauth2/token',
        useBasicAuthorizationHeader: true
    });
}

FitbitApiClient.prototype = {
    getAuthorizeUrl: function (data) {
        console.log(data);
        return this.oauth2.authCode.authorizeURL({
            scope: data.scope,
            redirectUri: data.redirectUri
        }).replace('api', 'www');
    },

    getAccessToken: function (data) {
        var deferred = Q.defer();
          
        this.oauth2.authCode.getToken({
            code: data.code,
            redirect_uri: data.redirectUrl
        }, function (error, result) {
            console.log(error, result);
            if (error) {
                deferred.reject(error);
            } else {
                deferred.resolve(result);
            }
        });
        
        return deferred.promise;
    },
    
    refreshAccesstoken: function (data) {
        var deferred = Q.defer();
          
        var token = this.oauth2.accessToken.create({
            access_token: data.accessToken,
            refresh_token: data.refreshToken,
            expires_in: -1
        });
          
        token.refresh(function (error, result) {
            if (error) {
                deferred.reject(error);
            } else {
                deferred.resolve(result.token);
            }
        });
        
        return deferred.promise;
    },
    
    get: function (path, accessToken, userId) {
        var deferred = Q.defer();
        
        Request({
            url: getUrl(path, userId), 
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + accessToken
            },
            json: true
        }, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                deferred.resolve([
                    body,
                    response
                ]);
            }
        });
        
        return deferred.promise;
    },

    post: function (path, accessToken, data, userId) {
        var deferred = Q.defer();
        
        Request({
            url: getUrl(path, userId), 
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + accessToken
            },
            json: true,
            body: data
        }, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                deferred.resolve([
                    body,
                    response
                ]);
            }
        });
        
        return deferred.promise;
    },

    put: function (path, accessToken, data, userId) {
        var deferred = Q.defer();
        
        Request({
            url: getUrl(path, userId), 
            method: 'PUT',
            headers: {
                Authorization: 'Bearer ' + accessToken
            },
            json: true,
            body: data
        }, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                deferred.resolve([
                    body,
                    response
                ]);
            }
        });
        
         return deferred.promise;
    },

    delete: function (path, accessToken, userId) {
        var deferred = Q.defer();
        
        Request({
            url: getUrl(path, userId), 
            method: 'DELETE',
            headers: {
                Authorization: 'Bearer ' + accessToken
            },
            json: true
        }, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                deferred.resolve([
                    body,
                    response
                ]);
            }
        });
        
        return deferred.promise;
    }
};

function getUrl(path, userId) {
    return url = 'https://api.fitbit.com/1/user/' + (userId || '-') + path;
}

module.exports = FitbitApiClient;
