import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useState } from 'react'
import axios from 'axios'
import { useRouter } from '@/routes/hooks'

const formSchema = z.object({
    username: z.string().nonempty({ message: 'Введите логин' }),
    password: z.string().nonempty({ message: 'Введите пароль' })
})

type UserFormValue = z.infer<typeof formSchema>

export default function UserAuthForm() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const form = useForm<UserFormValue>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: '',
            password: ''
        }
    })

    const onSubmit = async (data: UserFormValue) => {
        try {
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

            setLoading(true)
            const params = new URLSearchParams()
            params.append('username', data.username)
            params.append('password', data.password)

            // Отправляем запрос на получение токена
            const response = await axios.post(`${API_BASE_URL}/api/v1/auth/token`, params, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })

            const token = response.data.access_token
            if (token) {
                localStorage.setItem('authToken', token)

                // Получаем данные текущего пользователя
                const userResponse = await axios.get(`${API_BASE_URL}/api/v1/auth/currentuser`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                console.log('User info:', userResponse.data)

                localStorage.setItem('username', userResponse.data.username)

                // Перенаправление после входа
                router.push('/bids')
            }
        } catch (error) {
            console.error('Ошибка входа:', error)
            alert('Неверный логин или пароль')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='w-full space-y-6'>
                <FormField
                    control={form.control}
                    name='username'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Логин</FormLabel>
                            <FormControl>
                                <Input className='py-6' type='text' placeholder='Введите логин...' disabled={loading} {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name='password'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Пароль</FormLabel>
                            <FormControl>
                                <Input className='py-6' type='password' placeholder='Введите пароль...' disabled={loading} {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button disabled={loading} className='ml-auto w-full p-6' type='submit'>
                    Вход
                </Button>
              
            </form>
        </Form>
    )
}
