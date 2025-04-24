"use client"
import Image from 'next/image';
import Link from 'next/link';
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button';
import { FormEvent, useState } from 'react';
import axios from "axios"
import { toast } from "sonner"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import { ArrowLeft } from 'lucide-react';

type RegisterProps = ({
    setRegisterOpen: (open: boolean) => void,
    setLoginOpen: (open: boolean) => void,
    registerOpen: boolean,
})

type ValidationError = ({
    location: "",
    msg: "",
    path: "",
    type: ""
    value: ""
})

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"


export default function Register({ setRegisterOpen, registerOpen, setLoginOpen }: RegisterProps) {
    const [newUser, setNewUser] = useState({
        email: "",
        password: "",
        confirmPassword: ""
    })

    const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);

    const isFormComplete = Object.values(newUser).every((val) => val.trim() !== "");

    const [loadingNewUser_Submission, setLoadingNewUser_Submission] = useState(false)

    const [isOPTOpen, setIsOPTOpen] = useState(false)
    const [otp, setOtp] = useState({
        email: "",
        code: ""
    });

    async function createNewUser() {
        setLoadingNewUser_Submission(true)

        try {
            const response = await axios.post(`${apiUrl}/users/register`, newUser);
            toast.success(response.data.message);
            setIsOPTOpen(true)
            setOtp({...otp, email: newUser.email})
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response?.data.error) {
                setValidationErrors(error.response.data.error)
            } else {
                toast.error("An internal server error occurred. Please try again later.");
            }
        } finally {
            setLoadingNewUser_Submission(false);
        }
    }

    const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await createNewUser();
      };


    async function verifyNewUser(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoadingNewUser_Submission(true)
        try {
            const response = await axios.post(`${apiUrl}/users/verify`, otp);
            toast.success(response.data.message);
            setNewUser({
                email: "",
                password: "",
                confirmPassword: ""
            })
            setOtp({
                email: "",
                code: ""
            });
            setRegisterOpen(false)
            
        
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response?.data.error) {
                const errors = error.response.data.error;
                errors.forEach((err: { msg: string }) => toast.error(err.msg));
            } else {
                toast.error("An internal server error occurred. Please try again later.");
            }
        } finally {
            setLoadingNewUser_Submission(false);
        }
    }



    return (
        <Dialog open={registerOpen} onOpenChange={setRegisterOpen}>
            <DialogContent className="sm:h-[38rem]  w-[32rem] bg-white text-black shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)]">
                {isOPTOpen && newUser.email ?
                    <form
                    onSubmit={verifyNewUser}
                    className=" h-full  space-y-4 px-6 py-8 flex flex-col items-center sm:rounded-2xl  ">
                        <div className="hover:bg-gray-200 cursor-pointer  rounded-full ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 left-4 opacity-70 transition-opacity hover:opacity-100  focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
                            onClick={() => setIsOPTOpen(false)}
                        >
                            <ArrowLeft className="m-2" style={{ height: "1.5rem", width: "1.5rem" }} />
                            <span className="sr-only">Close</span>
                        </div>
                        <DialogTitle className='mt-14' style={{ fontSize: "1.5rem", fontWeight: "700" }}>Verification</DialogTitle>
                        <DialogDescription>
                            Enter the 6-digit code we sent to {newUser.email}
                        </DialogDescription>
                        <InputOTP value={otp.code} onChange={(value)=>setOtp({...otp, code: value})} maxLength={6} className=''>
                            <InputOTPGroup>
                                <InputOTPSlot index={0} />
                                <InputOTPSlot index={1} />
                                <InputOTPSlot index={2} />
                            </InputOTPGroup>
                            <InputOTPSeparator />
                            <InputOTPGroup>
                                <InputOTPSlot index={3} />
                                <InputOTPSlot index={4} />
                                <InputOTPSlot index={5} />
                            </InputOTPGroup>
                        </InputOTP>
                        <p className='mt-auto text-sm'>
                            Didn&apos;t get an email?
                            <span
                                onClick={createNewUser} 
                                className=' cursor-pointer text-blue-500 '> Resend</span>
                        </p>
                        <DialogFooter className='md:w-[85%] w-[100%] '>
                            <Button
                                variant={"default"}
                                disabled={otp.code.length !== 6}
                                style={{ backgroundColor: "black", color: "white" }}
                                className='w-full text-center  rounded-3xl cursor-pointer py-3 px-3 flex flex-row justify-between items-center'
                            >Submit</Button>
                        </DialogFooter>
                    </form>
                    :
                    <form
                        onSubmit={handleFormSubmit}
                        className=" space-y-4  px-6 py-8 flex flex-col items-center sm:rounded-2xl  "
                        onClick={(e) => e.stopPropagation()}
                    >   <div className='w-full flex items-center justify-end '>
                        </div>
                        <DialogTitle style={{ fontSize: "1.5rem", fontWeight: "700" }}>Register</DialogTitle>
                        <DialogDescription className='md:w-[85%] w-[100%] text-sm text-center'>By continuing, you agree to our <Link href={"/Agreement"} className='hover:underline text-blue-600'>User Agreement</Link> and acknowledge that you understand the  <Link href={"/Agreement"} className='hover:underline text-blue-600'>Privacy Policy</Link>.</DialogDescription>
                        <div className='md:w-[85%] w-[100%] text-xs rounded-3xl border-gray-300 hover:bg-gray-50 cursor-pointer border py-3 px-3 flex flex-row justify-between items-center'>
                            <p>Register with Google</p>
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
                                value={newUser.email}
                                onChange={(e) => { setNewUser({ ...newUser, email: e.target.value }) }}
                                className=' rounded-3xl border-gray-300 hover:bg-gray-50 cursor-pointer border py-3 px-3 flex flex-row justify-between items-center' />
                            <input
                                placeholder='Password'
                                required
                                type='password'
                                value={newUser.password}
                                onChange={(e) => { setNewUser({ ...newUser, password: e.target.value }) }}
                                className=' rounded-3xl border-gray-300 hover:bg-gray-50 cursor-pointer border py-3 px-3 flex flex-row justify-between items-center' />
                            <input
                                placeholder='Confirm Password'
                                required
                                type='password'
                                value={newUser.confirmPassword}
                                onChange={(e) => { setNewUser({ ...newUser, confirmPassword: e.target.value }) }}
                                className=' rounded-3xl border-gray-300 hover:bg-gray-50 cursor-pointer border py-3 px-3 flex flex-row justify-between items-center' />
                        </div>
                        <div className='md:w-[85%] w-[100%] flex flex-col space-y-2 text-sm'>
                            <p>
                                Already have an account?
                                <span
                                    onClick={() => {
                                        setRegisterOpen(false)
                                        setLoginOpen(true)
                                    }}
                                    className=' cursor-pointer text-blue-500 '> Log in</span>
                            </p>
                        </div>
                        <DialogFooter className='md:w-[85%] w-[100%] mt-auto '>
                            <Button
                                variant={"default"}
                                disabled={!isFormComplete || loadingNewUser_Submission}
                                style={{ backgroundColor: "black", color: "white" }}
                                className='w-full text-center  rounded-3xl cursor-pointer py-3 px-3 flex flex-row justify-between items-center'
                                onClick={() =>
                                    validationErrors.map(validatedError => {
                                        toast(`Error: ${validatedError.type} ${validatedError.path}`, {
                                            description: validatedError.msg,
                                        })
                                    })
                                }
                            >{loadingNewUser_Submission ? "Submitting..." : "Submit"}</Button>
                        </DialogFooter>
                    </form>
                }
            </DialogContent>
        </Dialog>
    )
}