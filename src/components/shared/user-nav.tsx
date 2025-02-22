import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { useEffect, useState } from 'react'
import { LogIn } from 'lucide-react'

    export default function UserNav({ isMinimized = false }: { isMinimized?: boolean }) {

    const [username, setUsername] = useState('')

    useEffect(() => {
        setUsername(localStorage.getItem('username') || 'Гость')
    }, [])
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className='flex items-center mr-8 md:mr-0'>
                    <Button variant='ghost' className='relative h-14 w-14 rounded-full mr-3'>
                        <Avatar className='h-14 w-14 mr-[14px]'>
                            <AvatarImage
                                src={
                                    'https://png.pngtree.com/png-clipart/20230927/original/pngtree-man-avatar-image-for-profile-png-image_13001882.png'
                                }
                                alt={''}
                            />
                            <AvatarFallback>{username}</AvatarFallback>
                        </Avatar>
                    </Button>
                    <div>
                        <div className={isMinimized ? 'hidden' : 'inline-block'}>{username}</div>
                    </div>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-56' align='end' forceMount>
                <DropdownMenuLabel className='font-normal'>
                    <div className='flex flex-col space-y-1'>
                        <p className='text-sm font-medium leading-none'>{username}</p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => console.log('logout')}>
                    Выход
                    <DropdownMenuShortcut><LogIn/>
                    </DropdownMenuShortcut>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
