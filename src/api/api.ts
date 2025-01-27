import axios from 'axios'

const API_URL = 'https://portal.bgruz.com/docs'

export const fetchPublicData = async endpoint => {
    try {
        const response = await axios.get(`${API_URL}/${endpoint}`)
        return response.data
    } catch (error) {
        console.error('Error fetching public data:', error)
        throw error
    }
}

export const fetchPrivateData = async (endpoint, token) => {
    try {
        const response = await axios.get(`${API_URL}/${endpoint}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response.data
    } catch (error) {
        console.error('Error fetching private data:', error)
        throw error
    }
}

export const postData = async (endpoint, data, token = null) => {
    try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {}
        const response = await axios.post(`${API_URL}/${endpoint}/`, data, { headers })
        return response.data
    } catch (error) {
        console.error('Error posting data:', error)
        throw error
    }
}

export const putData = async (endpoint, data, token = null) => {
    try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {}
        const response = await axios.put(`${API_URL}/${endpoint}/`, data, { headers })
        return response.data
    } catch (error) {
        console.error('Error updating data:', error)
        throw error
    }
}

export const deleteData = async (endpoint, token = null) => {
    try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {}
        const response = await axios.delete(`${API_URL}/${endpoint}/`, { headers })
        return response.data
    } catch (error) {
        console.error('Error deleting data:', error)
        throw error
    }
}
