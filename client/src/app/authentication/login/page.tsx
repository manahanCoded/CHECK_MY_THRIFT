"use client"
import Image from 'next/image';
import Link from 'next/link';
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button';
import { DialogDescription } from '@radix-ui/react-dialog';

type LoginProps = ({
    setLoginOpen: (open: boolean) => void,
    setRegisterOpen: (open: boolean) => void,
    loginOpen: boolean,
})

export default function Login({ setLoginOpen, loginOpen, setRegisterOpen }: LoginProps) {




    return (
        <div>
            <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
                <DialogContent className="sm:h-[38rem]  w-[32rem] bg-white text-black shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)]">
                    <form className=" space-y-4  px-6 py-8 flex flex-col items-center sm:rounded-2xl  "
                        onClick={(e) => e.stopPropagation()}
                    >   <div className='w-full flex items-center justify-end '>
                        </div>
                        <DialogTitle style={{ fontSize: "1.5rem", fontWeight: "700" }}>Log In</DialogTitle>
                        <DialogDescription className='md:w-[85%] w-[100%] text-sm text-center'>By continuing, you agree to our <Link href={"/Agreement"} className='hover:underline text-blue-600'>User Agreement</Link> and acknowledge that you understand the  <Link href={"/Agreement"} className='hover:underline text-blue-600'>Privacy Policy</Link>.</DialogDescription>
                        <div className='md:w-[85%] w-[100%] text-xs rounded-3xl border-gray-300 hover:bg-gray-50 cursor-pointer border py-3 px-3 flex flex-row justify-between items-center'>
                            <p>Continue with Google</p>
                            <Image src={"/Authentication/google.png"} width={18} height={18} alt='google login' />
                        </div>
                        <div className="md:w-[85%] w-[100%] flex items-center gap-4 ">
                            <hr className="flex-grow border-t border-gray-300" />
                            <p className="text-sm text-gray-500">OR</p>
                            <hr className="flex-grow border-t border-gray-300" />
                        </div>
                        <div className="md:w-[85%] w-[100%] flex flex-col gap-3">
                            <input
                                placeholder='Email'
                                required
                                type='email'
                                className=' rounded-3xl border-gray-300 hover:bg-gray-50 cursor-pointer border py-3 px-3 flex flex-row justify-between items-center' />
                            <input
                                placeholder='Password'
                                required
                                type='password'
                                className=' rounded-3xl border-gray-300 hover:bg-gray-50 cursor-pointer border py-3 px-3 flex flex-row justify-between items-center' />
                        </div>
                        <div className='md:w-[85%] w-[100%] flex flex-col space-y-2 text-sm'>
                            <Link
                                onClick={()=> setLoginOpen(false)}
                                href={"/forgot-password"} className='text-blue-500 '>Forgot Password?</Link>
                            <p>
                                Don&apos;t have an account?
                                <span
                                    onClick={() => {
                                        setLoginOpen(false)
                                        setRegisterOpen(true)
                                    }}
                                    className='cursor-pointer text-blue-500 '> Register</span></p>
                        </div>
                        <DialogFooter className='md:w-[85%] w-[100%] mt-auto '>
                            <Button
                                variant={"default"}
                                disabled
                                style={{ backgroundColor: "black", color: "white" }}
                                className='w-full text-center  rounded-3xl cursor-pointer py-3 px-3 flex flex-row justify-between items-center'
                            >Submit</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}