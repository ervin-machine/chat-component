import axios from 'axios'
import { assign } from 'lodash'

const singletonEnforcer = Symbol()

class AxiosClient {
    axiosClient
    static aciosClientInstance

    constructor(enforcer) {
        if(enforcer !== singletonEnforcer) {
            throw new Error('Cannot initialise Axios client single instance')
        }

        this.axiosClient = axios.create({
            baseURL : 'http://localhost:8000',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        })
        
        this.axiosClient.interceptors.request.use(
            (configure) => {
                return configure
            },
            (error) => {
                return Promise.reject(error.response.data.message)
            }
        )

        this.axiosClient.interceptors.response.use(
            (response) => {
                /*if(response.data.data && Array.isArray(response.data.data.data)) {
                    response.data.data.dataObject = response.data.data.data.reduce((dataObject, item) => {
                        dataObject[item.id] = item
                        return dataObject
                    }, {})
                }*/
                return response.data
            },
            (error) => {
                return Promise.reject(error.response.data.message)
            }
        )
    }

    static get instance() {
        if(!this.axiosClientInstance) {
            this.axiosClientInstance = new AxiosClient(singletonEnforcer)
        }

        return this.axiosClientInstance
    }

    setHeader(userToken = '') {
        this.axiosClient.defaults.headers.Authorization = `Bearer ${userToken}`
    }

    get(resource, config = {}) {
        const requestURL = `${resource}`
        return this.axiosClient
            .get(requestURL, config)
    }

    post(resource, data, config = {}) {
        return this.axiosClient
            .post(`${resource}`, data, assign(config, this.axiosClient.defaults.headers))
    }

    update(resource, data, config = {}) {
        return this.axiosClient
            .put(`${resource}`, data, assign(config, this.axiosClient.defaults.headers))
    }

    put(resource, data, config = {}) {
        return this.axiosClient
            .put(`${resource}`, data, assign(config, this.axiosClient.defaults.headers))
    }

    delete(resource, data, config = {}) {
        return this.axiosClient
            .delete(`${resource}`, {
                params: data,
                ...assign(
                    config,
                    this.axiosClient.defaults.headers
                )
            })
    }
}

export default AxiosClient.instance