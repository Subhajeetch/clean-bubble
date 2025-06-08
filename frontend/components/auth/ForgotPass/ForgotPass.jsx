import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import ForgotPasswordFlow from "./MainOne.jsx";

const ForgotPass = () => {
    return (
        <Dialog>
            <DialogTrigger className='cursor-pointer'>Forgot password?</DialogTrigger>
            <DialogContent>
                <DialogHeader className='sr-only'>
                    <DialogTitle>Change Password</DialogTitle>
                    <DialogDescription>
                        This is the section where you change your password.
                    </DialogDescription>
                </DialogHeader>
                <ForgotPasswordFlow />

            </DialogContent>
        </Dialog>
    );
};

export default ForgotPass;