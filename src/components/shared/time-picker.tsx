// import React, { useState, useEffect, useRef } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { format, addMinutes, startOfHour, isValid, parse } from "date-fns";

// interface TimePickerProps {
//   value: string | undefined;
//   onChange: (time: string) => void;
  
// }

// const generateTimeOptions = (startTime: Date): string[] => {
//   const times: string[] = []; // Явно указываем, что это массив строк
//   let current: Date = addMinutes(startTime, Math.ceil(startTime.getMinutes() / 10) * 10); // Указываем, что current — это Date
//   const endTime: Date = addMinutes(current, 24 * 60); // Указываем, что endTime — это Date

//   while (current <= endTime) {
//     times.push(format(current, "HH:mm"));
//     current = addMinutes(current, 10);
//   }

//   return times;
// };



// const TimePicker: React.FC<TimePickerProps> = ({ value, onChange }) => {
//   const [inputValue, setInputValue] = useState(value || "");
//   const [showOptions, setShowOptions] = useState(false);
//   const [timeOptions, setTimeOptions] = useState<string[]>([]);
//   const containerRef = useRef<HTMLDivElement | null>(null);

//   useEffect(() => {
//     const now = new Date();
//     const roundedNow = addMinutes(startOfHour(now), Math.ceil(now.getMinutes() / 10) * 10);
//     setTimeOptions(generateTimeOptions(roundedNow));
//   }, []);

//   useEffect(() => {
//     if (showOptions) {
//       containerRef.current?.focus();
//     }
//   }, [showOptions]);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setInputValue(e.target.value);
//     const parsedTime = parse(e.target.value, "HH:mm", new Date());
//     if (isValid(parsedTime)) {
//       onChange(format(parsedTime, "HH:mm"));
//     }
//   };

//   return (
//     <div className="relative w-full">
//       <Input
//         type="time"
//         value={inputValue}
//         onChange={handleInputChange}
//         onFocus={() => setShowOptions(true)}
//         className="w-full"
//       />
//       {showOptions && (
//         <div
//           ref={containerRef}
//           tabIndex={0}
//           className="absolute z-10 mt-2 w-full max-h-48 overflow-auto bg-white border rounded-md shadow-lg"
//           onBlur={() => setShowOptions(false)}
//         >
//           {timeOptions.map((time) => (
//             <Button
//               key={time}
//               variant="ghost"
//               className="w-full justify-start px-4 py-2"
//               onMouseDown={() => {
//                 onChange(time);
//                 setInputValue(time);
//                 setShowOptions(false);
//               }}
//             >
//               {time}
//             </Button>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default TimePicker;


import React, { useState, useEffect } from "react";
import { format, addMinutes, startOfHour } from "date-fns";
import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TimePickerProps {
  value: string | undefined;
  onChange: (time: string) => void;
}

const generateTimeOptions = (startTime: Date): string[] => {
  const times: string[] = [];
  let current: Date = addMinutes(startTime, Math.ceil(startTime.getMinutes() / 10) * 10);
  const endTime: Date = addMinutes(current, 24 * 60);

  while (current <= endTime) {
    times.push(format(current, "HH:mm"));
    current = addMinutes(current, 10);
  }

  return times;
};

const TimePicker: React.FC<TimePickerProps> = ({ value, onChange }) => {
  const [inputValue, setInputValue] = useState(value || "");
  const [timeOptions, setTimeOptions] = useState<string[]>([]);

  useEffect(() => {
    const now = new Date();
    const roundedNow = addMinutes(startOfHour(now), Math.ceil(now.getMinutes() / 10) * 10);
    setTimeOptions(generateTimeOptions(roundedNow));
  }, []);

  // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setInputValue(e.target.value);
  //   const parsedTime = parse(e.target.value, "HH:mm", new Date());
  //   if (isValid(parsedTime)) {
  //     onChange(format(parsedTime, "HH:mm"));
  //   }
  // };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          {inputValue || "Выберите время"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 max-h-48 overflow-auto">
        {timeOptions.map((time) => (
          <DropdownMenuItem
            key={time}
            onSelect={() => {
              onChange(time);
              setInputValue(time);
            }}
          >
            {time}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TimePicker;