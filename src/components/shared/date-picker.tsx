// import * as React from "react";
// import { format } from "date-fns";
// import { Calendar as CalendarIcon } from "lucide-react";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import { Calendar } from "@/components/ui/calendar";
// import { Button } from "@/components/ui/button";

// interface DatePickerProps {
//   value: Date | undefined;
//   onChange: (date: Date | undefined) => void;
// }

// const DatePicker: React.FC<DatePickerProps> = ({ value, onChange }) => {
//   return (
//     <Popover>
//       <PopoverTrigger asChild>
//         <Button variant="outline" className="w-full justify-start text-left">
//           {value ? format(value, "dd.MM.yyyy") : "Выберите дату"}
//           <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
//         </Button>
//       </PopoverTrigger>
//       <PopoverContent className="w-auto p-0">
//         <Calendar
//           mode="single"
//           selected={value}
//           onSelect={onChange}
//           initialFocus
//         />
//       </PopoverContent>
//     </Popover>
//   );
// };

// export default DatePicker;


import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";

interface DatePickerProps {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  minDate?: Date; // Добавили minDate как необязательный пропс
  disabled?: boolean;
}

const DatePicker: React.FC<DatePickerProps> = ({ value, onChange, minDate }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-start text-left">
          {value ? format(value, "dd.MM.yyyy") : "Выберите дату"}
          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          initialFocus
          disabled={(date) => Boolean(minDate && date < minDate)} 
        />
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
