import React from "react";
import TimePickerLib from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";

interface TimePickerProps {
  value: string | undefined;
  onChange: (time: string | null) => void;
}

const TimePicker: React.FC<TimePickerProps> = ({ value, onChange }) => {
  return (
    <div className="w-full">
      <TimePickerLib
        onChange={onChange}
        value={value || ""}
        disableClock={true} 
        format="HH:mm" 
        className="w-full border rounded-md px-4 py-2 shadow-inner drop-shadow-xl"
      />
    </div>
  );
};

export default TimePicker;
