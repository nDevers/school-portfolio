import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaFacebook, FaLinkedin, FaYoutube } from "react-icons/fa";
import { GoDeviceMobile, GoLink, GoLocation, GoMail } from "react-icons/go";
import { Button } from "../ui/button";

export default function ContactDetailsCard() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className='text-primary'>More about us</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
                <div>
                    <h1 className="text-primary text-base md:text-lg lg:text-xl font-bold flex items-center space-x-2 pb-1"> <GoLocation /> <span>Company Location</span></h1>
                    <p>Adress: 23, Shahid Minar Road (West Side of BRTC Kallyanpur Bus Depot), Kallyanpur, Dhaka-1207</p>
                </div>
                <div>
                    <h1 className="text-primary text-base md:text-lg lg:text-xl font-bold flex items-center space-x-2 pb-1"> <GoMail /> <span>Email us directly</span></h1>
                    <p>bcssociety1979@gmail.com</p>
                    <p>info@bcsbd.org.bd</p>
                </div>
                <div>
                    <h1 className="text-primary text-base md:text-lg lg:text-xl font-bold flex items-center space-x-2 pb-1"> <GoDeviceMobile /> <span>Phone Number</span></h1>
                    <p>01753827949</p>
                    <p>01836794381</p>
                </div>
                <div>
                    <h1 className="text-primary text-base md:text-lg lg:text-xl font-bold flex items-center space-x-2 pb-1"> <GoLink /> <span>Social Link</span></h1>
                    <p className="space-x-2">
                        <Facebook/>
                        <Youtube/>
                        <Linkedin/>
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}

export const Facebook = () => {
    return(
        <Button size='icon' variant='outline'>
            <FaFacebook className="h-6 w-6 text-blue-500"/>
        </Button>
    )
}

export const Youtube = () => {
    return(
        <Button size='icon' variant='outline'>
            <FaYoutube className="h-6 w-6 text-rose-500"/>
        </Button>
    )
}

export const Linkedin = () => {
    return(
        <Button size='icon' variant='outline'>
            <FaLinkedin className="h-6 w-6 text-indigo-500"/>
        </Button>
    )
}