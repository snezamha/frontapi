import { useState } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";

interface DateTimePickerProps {
  placeholder?: string;
  value?: Date;
  onChange: (date?: Date) => void;
  className?: string;
  t: (key: string) => string;
}

export function DateTimePicker({
  placeholder,
  value,
  onChange,
  t,
}: DateTimePickerProps) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(value);

  const initialHours = date?.getHours() ?? 12;
  const initialMinutes = date?.getMinutes() ?? 0;
  const [time, setTime] = useState<{ hours: number; minutes: number }>({
    hours: initialHours,
    minutes: initialMinutes,
  });

  function handleDateSelect(selectedDate: Date | undefined) {
    if (selectedDate) {
      const newDate = new Date(selectedDate);
      newDate.setHours(time.hours);
      newDate.setMinutes(time.minutes);
      setDate(newDate);
      onChange(newDate);
    } else {
      setDate(undefined);
      onChange(undefined);
    }
    setOpen(false);
  }

  function handleTimeChange(e: React.ChangeEvent<HTMLInputElement>) {
    const [hrs, mins] = e.target.value.split(":").map(Number);
    if (date) {
      const newDate = new Date(date);
      newDate.setHours(hrs);
      newDate.setMinutes(mins);
      setDate(newDate);
      onChange(newDate);
    } else {
      setTime({ hours: hrs, minutes: mins });
    }
  }

  const formattedDate = date ? format(date, "PPP") : "";
  const formattedTime = date
    ? `${String(date.getHours()).padStart(2, "0")}:${String(
        date.getMinutes(),
      ).padStart(2, "0")}`
    : `${String(time.hours).padStart(2, "0")}:${String(time.minutes).padStart(
        2,
        "0",
      )}`;

  // const now = new Date();
  // now.setHours(0, 0, 0, 0);
  // const oneYearFromNow = new Date(
  //   now.getFullYear() + 1,
  //   now.getMonth(),
  //   now.getDate()
  // );

  return (
    <div className="flex items-center space-x-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="default"
            className={cn(
              "w-full justify-center text-center font-normal",
              !date && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="w-4 h-4 mr-2 rtl:ml-2" />
            {date ? `${formattedDate} ${formattedTime}` : t(placeholder ?? "")}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" align="center">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(day) => handleDateSelect(day ?? undefined)}
            // disabled={(day) => day < now || day > oneYearFromNow}
            initialFocus
          />
          <div className="p-3 border-t border-border">
            <Input
              type="time"
              value={formattedTime}
              onChange={handleTimeChange}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
