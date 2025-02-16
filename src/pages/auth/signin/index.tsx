import UserAuthForm from './components/user-auth-form'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Link } from 'react-router-dom'

import logo from '/logoRb.png'

export default function SignInPage() {
    return (
        <div className='relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0'>
            <Link
                to='/'
                className={cn(
                    buttonVariants({ variant: 'ghost' }),
                    'absolute right-4 top-4 hidden md:right-8 md:top-8'
                )}
            >
                Login
            </Link>
            <div className='relative hidden h-full  flex-col  p-10 text-white dark:border-r  lg:flex  lg:justify-center'>
                <img src={logo} alt="" className='' />
            </div>
            <div className='flex h-full items-center p-4 lg:p-8'>
                <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[370px]'>
                    <div className='flex flex-col space-y-2 text-center'>
                        <h1 className='text-2xl text-primary text-[39px] font-semibold tracking-tight'>Добро пожаловать!</h1>
                        <p>Введите данные для входа</p>
                    </div>
                    <UserAuthForm />
               
                </div>
            </div>
        </div>
    )
}
