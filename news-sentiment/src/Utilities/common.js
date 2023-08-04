import axios from "axios";

const axiosService = {
    Get: async function (url, endpoint, params) {
        var config = {
            params: params
        }
        var res = await axios.get(url + `/${endpoint}`, config)
            .then(response => {
                if (response) {
                    console.log(response);
                    return response;
                } else {
                    return "Empty response"
                }
            })
            .catch(err => {
                console.log(`Error sending get: ${err}`);
                return err;
            });
        return res;
    },
    Post: async function (endpoint, body, headers) {
        var config = {
            headers: headers,
            redirect: 'follow'
        }

        var res = await axios.post(endpoint, body, config)
            .then(response => {
                console.log(response);
                return response;
            })
            .catch(err => {
                console.log(err);
                return err;
            });
            return res;
    }
}

export default axiosService;