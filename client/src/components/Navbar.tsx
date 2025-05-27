"use client";
import Image from "next/image";
import Link from 'next/link';
import { useEffect, useState } from 'react';

import {
    CreditCard,
    Keyboard,
    LogOut,
    Settings,
    User,
    Bell,
    MessageCircleMore,
    ShoppingBasket,
    Search,
    XCircle,
    Menu
} from "lucide-react"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Login from "@/app/authentication/login/page";
import Register from "@/app/authentication/register/Register_dialog";
import axios from 'axios';
import { toast } from 'sonner';
import { fetchUser } from "@/Utilities/User";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SidebarTrigger, useSidebar } from "./ui/sidebar";



const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

const Navbar = () => {
    const [loginOpen, setLoginOpen] = useState(false)
    const [registerOpen, setRegisterOpen] = useState(false)
    const [user, setUser] = useState({
        id: "",
        email: "",
        username: "",
        phone_number: "",
        country: "",
        province: "",
        city: "",
        street: "",
        type: "",
        role: "",
        image: "",
        file_type: "",
        is_verified: "",
    })
    const [userLoading, setLoading] = useState(true)


    useEffect(() => {
        async function handleUser() {
            setLoading(true)
            if (!loginOpen && !registerOpen) {
                const user = await fetchUser()
                setUser(user)
            }
            setLoading(false)
        }
        handleUser()
    }, [loginOpen, registerOpen])

    async function HandleLogout() {
        try {
            const response = await axios.post(`${apiUrl}/users/logout`, {}, { withCredentials: true });
            toast.success(response.data.message);
            setUser({
                id: "",
                email: "",
                username: "",
                phone_number: "",
                country: "",
                province: "",
                city: "",
                street: "",
                type: "",
                role: "",
                image: "",
                file_type: "",
                is_verified: "",
            });

        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                toast.error(err.response?.data.error);
            } else {
                toast.error("Internal Server Error");
            }
        }
    }

    const { toggleSidebar } = useSidebar()

    return (
        <header
            className={`h-14 w-full border-b fixed inset-0 bg-background z-30  md:px-3.5 px-2 flex items-center gap-2  text-primary`}>
            <nav className='w-full flex items-center gap-x-2'>
                <section className='md:w-full w-[60%] flex items-center justify-start gap-2'>
                    <Menu className="md:hidden cursor-pointer" onClick={toggleSidebar}>Toggle Sidebar</Menu>
                    <Link href={"/"} className='dark:invert text-primary dark:drop-shadow-[0_0_0.3rem_#ffffff70]'>
                        <Image
                            src="/Branding_Img/CMT_Logo.png"
                            alt="Check My Thrift Logo"
                            width={80}
                            height={80}
                            className="md:block hidden select-none h-12 w-20 "
                            draggable={false}
                        />
                        <Image
                            src="/Branding_Img/CMT_Small_Logo.png"
                            alt="Check My Thrift Logo"
                            width={80}
                            height={80}
                            className="md:hidden block select-none  h-10 w-12"
                            draggable={false}
                        />
                    </Link>
                </section>
                <section className="w-full flex items-center justify-stretch">
                    <div className="md:h-10 h-9 bg-secondary hover:bg-input flex flex-row w-full items-center gap-2 text-sm focus-within:outline-1 px-4 py-2 rounded-4xl">
                        <Search className="w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search Thrift"
                            className="outline-none w-full"
                        />
                        <XCircle className="stroke-1 cursor-pointer" />
                    </div>
                </section>
                <section className='flex w-full items-center justify-end md:space-x-5 space-x-3.5 ml-2'>
                    <ShoppingBasket className='stroke-[1.5] cursor-pointer md:size-6 size-5.5' />
                    <MessageCircleMore className='stroke-[1.5] cursor-pointer md:size-6 size-5.5  ' />
                    <Bell className='stroke-[1.5] cursor-pointer md:size-6 size-5.5  ' />
                    {
                        userLoading ? (
                            <div className="w-6 h-6 border-3 border-primary border-t-transparent rounded-full animate-spin" />
                        ) : user?.id ? (
                            <div className='text-primary '>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild className="cursor-pointer">
                                        <Avatar>
                                            {user.type === "google" ? (
                                                <AvatarImage src={user.image} />
                                            ) : user.image ? (
                                                <AvatarImage src={`data:${user.file_type};base64,${user.image}`} />
                                            ) : (
                                                <AvatarFallback><User className=" stroke-[1.5]" /></AvatarFallback>
                                            )}
                                        </Avatar>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent side="bottom" align="end" sideOffset={8} className="w-64">
                                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuGroup>
                                            <DropdownMenuItem className="cursor-pointer">
                                                <User />
                                                <span>Profile</span>
                                                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="cursor-pointer">
                                                <CreditCard />
                                                <span>Billing</span>
                                                <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="cursor-pointer">
                                                <Settings />
                                                <span>Settings</span>
                                                <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="cursor-pointer">
                                                <Keyboard />
                                                <Link href={"/apartment"}>Pricing</Link>
                                                <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
                                            </DropdownMenuItem>
                                        </DropdownMenuGroup>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="cursor-pointer" onClick={HandleLogout}>
                                            <LogOut />
                                            <span>Log out</span>
                                            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        ) : (
                            <>
                                <p
                                    className='relative cursor-pointer font-semibold tracking-widest uppercase text-xs group '
                                    onClick={() => setLoginOpen(!loginOpen)}>
                                    <span>Login</span>
                                    <span className="absolute -bottom-2.5 left-1/2 w-0 h-1 bg-yellow-400 transition-all duration-300 group-hover:w-1/2"></span>
                                    <span className="absolute -bottom-2.5 right-1/2 w-0 h-1 bg-yellow-400 transition-all duration-300 group-hover:w-1/2"></span>
                                </p>
                                {loginOpen && <Login setLoginOpen={setLoginOpen} loginOpen={loginOpen} setRegisterOpen={setRegisterOpen} />}
                                {registerOpen && <Register setRegisterOpen={setRegisterOpen} registerOpen={registerOpen} setLoginOpen={setLoginOpen} />}
                            </>
                        )
                    }
                </section>
            </nav>
        </header>
    );
}


export default Navbar