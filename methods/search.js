var _ = require("lodash");

exports.methods = function(config){

    var http_methods = require([__dirname, "..", "http_methods"].join("/")).http_methods(config);

    return {
        // https://docs.chef.io/api_chef_server_search.html#get
        getSearchIndices: function(fn){
            http_methods.get([config.host_url, "search"].join("/"), null, function(err, response){
                return fn(err, response);
            });
        }, 

        // https://docs.chef.io/api_chef_server_search_index.html#get
        search: function(index, qs, fn){
            http_methods.get([config.host_url, "search", index].join("/"), qs, function(err, response){
                return fn(err, response);
            });
        },

        // https://docs.chef.io/api_chef_server_search_index.html#post
        partialSearch: function(index, qs, data, fn){
			var URL = [config.host_url, "search", index].join("/");
			qs.start=0;
			qs.rows=1000;
						
            http_methods.post(URL , qs, data, function(err, response){
               
				if (response) {
					qs.start=1000;
					qs.rows=1000;
					http_methods.post(URL , qs, data, function(err2, response2){
						if(response2 && _.has(response, 'rows') && _.has(response2, 'rows') ) {
							var temparray = response.rows.concat(response2.rows);
							response.rows = temparray;
							return fn(err, response );
						}else {
							return fn(err, response );
						}
					});
				}else if (err) {
					return fn(err, response);
				} else {
					return fn(err, response);
				}
					
				
            });
        }
    }
}
