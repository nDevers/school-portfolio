"use client"
import * as React from "react"
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export default function ComboboxFormik({ data, icon, select, display, description, placeholder = 'Select', formik, name, disable=false }) {
    const [open, setOpen] = React.useState(false);
    const triggerRef = React.useRef(null);
    const popoverRef = React.useRef(null);
    const [triggerWidth, setTriggerWidth] = React.useState(200); // Default width

    // Update the width of the popover based on the trigger's width
    React.useEffect(() => {
        if (triggerRef.current) {
            setTriggerWidth(triggerRef.current.offsetWidth);
        }
    }, [open]);

    // Get the selected value from Formik values
    const selectedValue = formik.values?.[name];

    // Find the selected item based on the "select" field
    const selectedItem = data ? data?.find((item) => item?.[select] === selectedValue) : '';

    // Handle selection and opening popup
    const handleSelect = (item) => {
        if (selectedValue === item?.[select]) {
            // If the same item is selected, clear the selection
            formik.setFieldValue(name, "");
        } else {
            // Otherwise, set the new selected value
            formik.setFieldValue(name, item?.[select]);
        }
        setOpen(false);  // Close the popover
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    ref={triggerRef}
                    variant="outline"
                    role="combobox"
                    disabled={disable}
                    aria-expanded={open}
                    className="w-full justify-between text-sm font-normal disabled:cursor-not-allowed"
                >
                    {icon && icon}
                    {selectedItem ? selectedItem[display] : placeholder}
                    <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent ref={popoverRef} className="p-0" style={{ width: triggerWidth }}>
                <Command>
                    <CommandInput placeholder="Search..." className="h-9" />
                    <CommandList>
                        <CommandEmpty>No item found.</CommandEmpty>
                        <CommandGroup>
                            {data && data.map(item => (
                                <CommandItem
                                    key={item?.[select]}
                                    value={item?.[select]}  // Store the select value (e.g., id)
                                    onSelect={() => handleSelect(item)}
                                >
                                    {item?.[display]}
                                    {description && ` - ${item?.[description]}`}
                                    <CheckIcon className={cn("ml-auto h-4 w-4", selectedValue === item?.[select] ? "opacity-100" : "opacity-0")}/>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
