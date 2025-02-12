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
            <div className='relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r  lg:flex'>
                <div className='absolute inset-0 bg-primary dark:bg-secondary' />
                <div className='relative z-20 flex items-center text-lg font-medium'>
                    <img src={logo} alt='' className='h-12' />
                    <span>
                        <span className='text-[#03b4e0]'>Биржа</span> Грузоверевозок
                    </span>
                </div>
                <div className='relative z-20 mt-auto'>
                    <blockquote className='space-y-2'>
                        <p className='text-lg'>
                            &ldquo;Сюда можете добавить какую нибудь цитату или важное инфо &rdquo;
                        </p>
                        <footer className='text-sm'>Амир Шодмонов</footer>
                    </blockquote>
                </div>
            </div>
            <div className='flex h-full items-center p-4 lg:p-8'>
                <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
                    <div className='flex flex-col space-y-2 text-center'>
                        <h1 className='text-2xl font-semibold tracking-tight'>Войти</h1>
                    </div>
                    <UserAuthForm />
               
                </div>
            </div>
        </div>
    )
}
