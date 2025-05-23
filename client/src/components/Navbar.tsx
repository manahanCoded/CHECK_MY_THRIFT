"use client";
import { Ellipsis, MessageCircleMore } from 'lucide-react';
import Image from "next/image";
import Link from 'next/link';
import { useEffect, useState } from 'react';

import {
    Cloud,
    CreditCard,
    Github,
    Keyboard,
    LifeBuoy,
    LogOut,
    Mail,
    MessageSquare,
    Plus,
    PlusCircle,
    Settings,
    User,
    UserPlus,
    Users,
    Bell,
} from "lucide-react"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Login from '@/app/authentication/login/page';
import Register from '@/app/authentication/register/Register_dialog';
import { usePathname } from 'next/navigation';
import axios from 'axios';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

const Navbar = () => {
    const [loginOpen, setLoginOpen] = useState(false)
    const [registerOpen , setRegisterOpen] = useState( false)
    const [user, setUser] = useState({
        id: "",
        email: "" ,
        username: "",
        phone_number: "",
        country: "",
        province: "",
        city: "",
        street: "",
        type: "",
        role: "",
        image: "",
        is_verified: "",
    })
    const navigate = usePathname()

    useEffect(()=>{
        async function handleUser() {
            try{
                const res = await axios.get(`${apiUrl}/users/profile`, {  withCredentials: true })
                console.log(res.data)
                setUser(res.data)
            }catch( error: unknown){
                if(axios.isAxiosError(error)  &&  error.response?.data.error){
                    console.error(error.response.data.error)
                }

            }
        } 

        handleUser()

    },[user])

    return (
        <section
            className={`h-14 w-full border-b fixed inset-0 bg-background z-30 py-2 px-3.5 flex items-center gap-2  text-primary`}>
            <div className='w-full flex flex-row items-center justify-between '>
                <div className='flex flex-row space-x-12'>
                    <Link href={"/"} className='dark:invert text-primary dark:drop-shadow-[0_0_0.3rem_#ffffff70]'>
                        <Image
                            src="/Branding_Img/CMT_Logo.png"
                            alt="Brand Logo"
                            width={80}
                            height={80}
                            className="select-none "
                            draggable={false}
                        />
                    </Link>
                    <div className='md:flex hidden text-xs flex-row justify-between items-center space-x-16 uppercase font-semibold tracking-widest'>
                        <Link
                            className='h-8 pb-2 drop-shadow-[0_0_0.3rem_#ffffff70] py-2 hover:border-b-3 border-transparent hover:border-primary  transition-[border] duration-200 ease-in'
                            href={"/apartment"}>Sales</Link>
                        <Link
                            className='h-8 pb-2 drop-shadow-[0_0_0.3rem_#ffffff70] py-2 hover:border-b-3 border-transparent hover:border-primary  transition-[border] duration-200 ease-in'
                            href={"/apartment"}>Sellers</Link>
                        <Link
                            className='h-8 pb-2 drop-shadow-[0_0_0.3rem_#ffffff70] py-2 hover:border-b-3 border-transparent hover:border-primary  transition-[border] duration-200 ease-in'
                            href={"/apartment"}>Affiliate</Link>
                        <Link
                            className='h-8 pb-2 drop-shadow-[0_0_0.3rem_#ffffff70] py-2 hover:border-b-3 border-transparent hover:border-primary  transition-[border] duration-200 ease-in'
                            href={"/apartment"}>About</Link>

                        <p>{user.id && user.id }</p>
                    </div>
                </div>
                <div className='flex flex-row items-center space-x-2'>
                    <MessageCircleMore className='stroke-[1.5] cursor-pointer h-6 w-6 ' />
                    <Bell className='stroke-[1.5] cursor-pointer h-6 w-6 ' />
                    <p
                        className='h-8 pb-2 cursor-pointer font-semibold tracking-widest uppercase text-xs drop-shadow-[0_0_0.3rem_#ffffff70] py-2 hover:border-b-3 border-transparent hover:border-primary  transition-[border] duration-200 ease-in'
                        onClick={() => setLoginOpen(!loginOpen)}>Login</p>
                    {loginOpen && <Login setLoginOpen={setLoginOpen} loginOpen={loginOpen} setRegisterOpen={setRegisterOpen} />}
                    {registerOpen && <Register setRegisterOpen={setRegisterOpen} registerOpen={registerOpen} setLoginOpen={setLoginOpen}/>}
                    {/* <div className='text-primary dark:drop-shadow-[0_0_0.3rem_#ffffff70]'>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Ellipsis className='cursor-pointer w-6 h-6 ' />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side="bottom" align="end" sideOffset={8} className="w-64">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem>
                                    <User />
                                    <span>Profile</span>
                                    <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <CreditCard />
                                    <span>Billing</span>
                                    <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Settings />
                                    <span>Settings</span>
                                    <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Keyboard />
                                    <Link href={"/apartment"}>Pricing</Link>
                                    <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem>
                                    <Users />
                                    <span>Team</span>
                                </DropdownMenuItem>
                                <DropdownMenuSub>
                                    <DropdownMenuSubTrigger>
                                        <UserPlus />
                                        <span>Invite users</span>
                                    </DropdownMenuSubTrigger>
                                    <DropdownMenuPortal>
                                        <DropdownMenuSubContent>
                                            <DropdownMenuItem>
                                                <Mail />
                                                <span>Email</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <MessageSquare />
                                                <span>Message</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem>
                                                <PlusCircle />
                                                <span>More...</span>
                                            </DropdownMenuItem>
                                        </DropdownMenuSubContent>
                                    </DropdownMenuPortal>
                                </DropdownMenuSub>
                                <DropdownMenuItem>
                                    <Plus />
                                    <span>New Team</span>
                                    <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <Github />
                                <span>GitHub</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <LifeBuoy />
                                <span>Support</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem disabled>
                                <Cloud />
                                <span>API</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <LogOut />
                                <span>Log out</span>
                                <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div> */}
                </div>
            </div>
        </section>
    );
}


export default Navbar