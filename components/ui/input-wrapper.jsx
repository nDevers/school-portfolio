import { cn } from '@/lib/utils'
import { Error } from '@/components/ui/error';
import { Label } from '@/components/ui/label';

export default function InputWrapper({ label, error, touched, children, className, ...props }) {
    return (
        <div className={cn("w-full space-y-2 my-2", className)} {...props}>
            {label && <Label>{label}</Label>}
            {children}
            {error && touched && <Error error={error} touched={touched} />}
        </div>
    )
}
