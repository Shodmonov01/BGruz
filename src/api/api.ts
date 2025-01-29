import axios from 'axios'

const API_URL = 'https://portal.bgruz.com'

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

export const postData2 = async <T>(endpoint: string, data: any, token: string | null = null): Promise<T> => {
    try {
        const headers = token ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } : {}
        const response = await axios.post<T>(`${API_URL}/${endpoint}`, data, { headers })

        return response.data
    } catch (error: any) {
        console.error('Ошибка запроса:', error)
        if (error.response) {
            console.error('Ответ сервера:', error.response.data)
            console.error('Статус:', error.response.status)
            console.error('Заголовки:', error.response.headers)
        }
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
