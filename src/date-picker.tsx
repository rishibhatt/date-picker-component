import { useState, useEffect } from "react";
import "./date-picker.css";
interface DateRangePickerProps {
    onRangeChange?: (range: [Date, Date], weekendDates: Date[]) => void;
    predefinedRanges?: { label: string; range: [Date, Date] }[];
}

function DateRangePicker({ onRangeChange, predefinedRanges }: DateRangePickerProps) {
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [selecting, setSelecting] = useState(true);
    const [weekendDates, setWeekendDates] = useState<Date[]>([]);

    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const generateDays = () => {
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const dates = [];
        for (let i = 0; i < firstDayOfMonth; i++) {
            dates.push(null);
        }
        for (let day = 1; day <= daysInMonth; day++) {
            dates.push(new Date(currentYear, currentMonth, day));
        }
        return dates;
    };

    const isInRange = (date: Date) => {
        return startDate && endDate && date >= startDate && date <= endDate;
    };

    const isWeekend = (date: Date) => {
        return date.getDay() === 0 || date.getDay() === 6;
    };

    const calculateWeekendDates = (start: Date, end: Date): Date[] => {
        const weekends = [];
        let currentDate = new Date(start);
        while (currentDate <= end) {
            if (isWeekend(currentDate)) weekends.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return weekends;
    };

    const handleDateClick = (date: Date) => {
        if (selecting) {
            setStartDate(date);
            setEndDate(null);
            setSelecting(false);
        } else {
            if (date >= startDate!) {
                setEndDate(date);
            } else {
                setStartDate(date);
                setEndDate(null);
            }
            setSelecting(true);
        }
    };

    const handleMonthChange = (direction: "prev" | "next") => {
        if (direction === "prev") {
            setCurrentMonth((prev) => (prev === 0 ? 11 : prev - 1));
            if (currentMonth === 0) setCurrentYear((prev) => prev - 1);
        } else {
            setCurrentMonth((prev) => (prev === 11 ? 0 : prev + 1));
            if (currentMonth === 11) setCurrentYear((prev) => prev + 1);
        }
    };

    const handleYearChange = (direction: "prev" | "next") => {
        setCurrentYear((prev) => (direction === "prev" ? prev - 1 : prev + 1));
    };

    const handleRangeChange = () => {
        if (startDate && endDate) {
            const weekends = calculateWeekendDates(startDate, endDate);
            setWeekendDates(weekends);
            if (onRangeChange) {
                onRangeChange([startDate, endDate], weekends);
            }
        }
    };

    const handlePredefinedRangeClick = (range: [Date, Date]) => {
        const today = new Date();
        setStartDate(range[0]);
        setEndDate(range[1]);
        setSelecting(true);
        setCurrentMonth(today.getMonth());
        setCurrentYear(today.getFullYear());
        const weekends = calculateWeekendDates(range[0], range[1]);
        setWeekendDates(weekends);
        if (onRangeChange) {
            onRangeChange(range, weekends);
        }
    };
    const refreshChange = () => {
        const today = new Date();
        setStartDate(null);
        setEndDate(null);
        setCurrentMonth(today.getMonth());
        setCurrentYear(today.getFullYear());
    }
    const handleTodayClick = () => {
        const today = new Date();
        setStartDate(new Date(today.getFullYear(), today.getMonth(), today.getDate()));
        setEndDate(null);
        setCurrentMonth(today.getMonth());
        setCurrentYear(today.getFullYear());
        setSelecting(true);
    };

    useEffect(() => {
        handleRangeChange();
    }, [startDate, endDate]);

    return (
        <div className="date-range-picker">
            <div className="header">
                <button onClick={() => handleYearChange("prev")}>&lt;&lt;</button>
                <button onClick={() => handleMonthChange("prev")}>&lt;</button>
                <span>{`${new Date(currentYear, currentMonth).toLocaleString("default", {
                    month: "long",
                })} ${currentYear}`}</span>
                <button onClick={() => handleMonthChange("next")}>&gt;</button>
                <button onClick={() => handleYearChange("next")}>&gt;&gt;</button>
            </div>
            <div className="calendar-grid">
                {daysOfWeek.map((day) => (
                    <div key={day} className="day-header">
                        {day}
                    </div>
                ))}
                {generateDays().map((date, index) =>
                    date ? (
                        <div
                            key={index}
                            className={`day ${isInRange(date) ? "in-range" : ""} 
                                ${date.getTime() === startDate?.getTime() ? "start-date" : ""} 
                                ${date.getTime() === endDate?.getTime() ? "end-date" : ""} 
                                ${isWeekend(date) ? "weekend" : ""}`}
                            onClick={() => !isWeekend(date) && handleDateClick(date)}
                        >
                            {date.getDate()}
                        </div>
                    ) : (
                        <div key={index} className="empty-slot"></div>
                    )
                )}
            </div>
            {predefinedRanges && (

                <div className="predefined-ranges">
                    <button onClick={handleTodayClick}>Today</button>
                    {predefinedRanges.map((range) => (
                        <button key={range.label} onClick={() => handlePredefinedRangeClick(range.range)}>
                            {range.label}
                        </button>
                    ))}
                    <button onClick={refreshChange}>Refresh</button>
                </div>
            )}
            <div className="selected-range">
                {startDate && endDate ? (
                    <>
                        <p>
                            Selected Range: {startDate.toDateString()} - {endDate.toDateString()}
                        </p>
                        {weekendDates.length > 0 && (
                            <p>Weekend Dates: {weekendDates.map((date) => date.toDateString()).join(", ")}</p>
                        )}
                    </>
                ) : startDate ? (
                    <p>Selected Start Date: {startDate.toDateString()}</p>
                ) : (
                    <p>No date selected</p>
                )}
            </div>
        </div>
    );
}

export default DateRangePicker;



