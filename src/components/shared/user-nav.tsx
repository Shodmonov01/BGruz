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

export default function UserNav({ isMinimized }) {
    const [username, setUsername] = useState('')

    useEffect(() => {
        setUsername(localStorage.getItem('username') || 'Гость')
    }, [])
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className='flex items-center'>
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
                        <p className='text-sm font-medium leading-none'>{'Admin'}</p>
                        <p className='text-xs leading-none text-muted-foreground'>{'admin@gmail.com'}</p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {/* <DropdownMenuGroup>
          <DropdownMenuItem>
            Profile
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Billing
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Settings
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>New Team</DropdownMenuItem>
        </DropdownMenuGroup> */}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => console.log('logout')}>
                    Log out
                    <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
