import axios from 'axios'

// export const API_URL = 'https://portal.bgruz.com'

const API_URL = axios.create({
    baseURL: 'https://portal.bgruz.com'
})

API_URL.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('authToken')
            setTimeout(() => {
                window.location.href = '/login'
            }, 100) // Даем браузеру время обработать очистку токена
        }
        return Promise.reject(error)
    }
)




export const fetchPublicData = async endpoint => {
    try {
        const response = await API_URL.get(`/${endpoint}`)
        return response.data
    } catch (error) {
        console.error('Error fetching public data:', error)
        throw error
    }
}

export const fetchPrivateData = async (endpoint, token) => {
    try {
        const response = await API_URL.get(`/${endpoint}`, {
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

export const postData = async (endpoint, data, token: string | null = null) => {
    try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {}
        const response = await API_URL.post(`/${endpoint}/`, data, { headers })
        return response.data
    } catch (error) {
        console.error('Error posting data:', error)
        throw error
    }
}

export const postData2 = async <T>(endpoint: string, data: any, token: string | null = null): Promise<T> => {
    try {
        const headers = token ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } : {}
        const response = await API_URL.post<T>(`/${endpoint}`, data, { headers })

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
        const response = await API_URL.put(`/${endpoint}/`, data, { headers })
        return response.data
    } catch (error) {
        console.error('Error updating data:', error)
        throw error
    }
}

export const deleteData = async (endpoint, token: string | null = null) => {
    try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {}
        const response = await API_URL.delete(`/${endpoint}/`, { headers })
        return response.data
    } catch (error) {
        console.error('Error deleting data:', error)
        throw error
    }
}


