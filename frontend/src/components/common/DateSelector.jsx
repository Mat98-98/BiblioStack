import { useState } from "react";
import { Button } from "@/components/ui/button.jsx";
import { Calendar as CalendarComponent } from "@/components/ui/calendar.jsx";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover.jsx";
import { CalendarIcon } from "lucide-react";
import {format, parseISO, isBefore, startOfDay, isAfter, getDay } from "date-fns";
import { it } from "date-fns/locale";

export default function DateSelector({
                                         value,                                 // Stringa in formato "YYYY-MM-DD" o oggetto Date
                                         onChange,                              // Callback che restituisce "YYYY-MM-DD" oppure ""
                                         placeholder = "Seleziona data",
                                         minDate = null,                   // Data minima bloccata
                                         maxDate = null,                   // Data massima bloccata
                                         excludeWeekends = false,       // Weekends non selezionabili
                                         captionLayout,                          // Dropdown, default
                                         startYear,                              // Data minima mostrata nel dropdown
                                         endYear,                                // Data massima mostrata nel dropdown
                                         className = ""
                                     }) {
    const [open, setOpen] = useState(false);


    // Converte il valore in ogg etto Date per il Calendar
    const selectedDate = value ? (typeof value === "string" ? parseISO(value) : value) : undefined;

    const handleSelect = (date) => {
        if (date) {
            // Restituisce la stringa standard formattata per il backend / hook form
            const formatted = format(date, "yyyy-MM-dd");
            onChange(formatted);
        } else {
            onChange("");
        }
        setOpen(false);
    };

    // Funzione per disabilitare le date fuori dal range (mindate e maxDate)
    const isDateDisabled = (date) => {
        const targetDate = startOfDay(date);
        if (minDate) {
            const parsedMinDate = typeof minDate === "string" ? parseISO(minDate) : minDate;
            if (isBefore(targetDate, startOfDay(parsedMinDate))) {
                return true;
            }
        }

        if (maxDate) {
            const parsedMaxDate = typeof maxDate === "string" ? parseISO(maxDate) : maxDate;
            if (isAfter(targetDate, startOfDay(parsedMaxDate))) {
                return true;
            }
        }

        if (excludeWeekends) {
            const dayOfWeek = getDay(targetDate);
            if (dayOfWeek === 0 || dayOfWeek === 6) {
                return true;
            }
        }

        return false;
    }

    // Converto la data minima e massima per il dropdown menu
    const startMonth = new Date(startYear, 0);
    const endMonth = new Date(endYear, 11);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    className={`justify-start text-left font-normal w-full ${className}`}
                >
                    <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground shrink-0" />
                    {selectedDate ? (
                        format(selectedDate, "PPP", { locale: it })
                    ) : (
                        <span className="text-muted-foreground">{placeholder}</span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleSelect}
                    locale={it}
                    captionLayout={captionLayout}
                    startMonth={startMonth}
                    endMonth={endMonth}
                    disabled={isDateDisabled}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    );
}