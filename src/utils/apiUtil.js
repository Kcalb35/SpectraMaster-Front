const apiBaseUrl = "/api"

async function uniFetch(url, options) {
    options = options || {};
    const method = options.method || 'GET';
    const headers = options.headers || {'Content-Type': 'application/json'};
    if (options.jwt){
        headers["Authorization"]=`Bearer ${options.jwt}`;
    }
    const body = JSON.stringify(options.body) || undefined;
    const response = await fetch(apiBaseUrl + url, {
        method,
        body,
        headers: headers
    });
    // request completed but response code not 200
    if (!response.ok) {
        // unauthorized, jump to login page
        if (response.status === 401) {
            throw {code:401,msg:'未登录或认证过期'};
        }
        let errMsg = null;
        if (response.status >= 400 && response.status < 500) {
            // if starting with 4, try to parse error message
            try {
                // try to get error data
                const { data } = await response.json();
                errMsg = { errMsg: data };
            } catch (e) {
                // on error, do thing and fallback to normal route
            }
        }
        if (errMsg) throw errMsg;
    }
    const {data} = await response.json();
    return data;
}

export { apiBaseUrl, uniFetch };
