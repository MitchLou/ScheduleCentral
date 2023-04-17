import React, {useEffect, useState} from "react";
import Axios from "axios";
import './Admin.css'
import {addDays, format, startOfWeek, endOfWeek, isSameWeek, isMonday, isTuesday, isWednesday, isThursday, isFriday, isSaturday, isSunday} from "date-fns";

function Admin() {
    const [employeeList, setEmployeeList] = useState([]);
    const [scheduleList, setScheduleList] = useState([]);
    const [weekStart, setWeekStart] = useState(startOfWeek(new Date(), {weekStartsOn: 0}));
    const [weekEnd, setWeekEnd] = useState(endOfWeek(new Date(), {weekEndsOn: 6}));
  

    const getEmployees = () => {
        Axios.get("http://localhost:3001/employees").then((response) => {
            setEmployeeList(response.data);
        });
      };

    const getSchedules = () => {
        Axios.get("http://localhost:3001/schedule").then((response) => {
            setScheduleList(response.data);
        });
      };

      useEffect(() => {
        getEmployees();
        getSchedules();
      }, []);



          const handleForwardArrowClick = () => {
            const newStart = addDays(weekStart, 7); // Increment start of week range by 7)
            const newEnd = addDays(weekEnd, 7);
            setWeekStart(newStart);
            setWeekEnd(newEnd); // Update week range state
          };
          
          // Function to handle backward arrow click
          const handleBackwardArrowClick = () => {
            const newStart = addDays(weekStart, -7); // Increment start of week range by 7)
            const newEnd = addDays(weekEnd, -7);
            setWeekStart(newStart);
            setWeekEnd(newEnd); // Update week range state
          };

  return (
    
    <div className="Attributes">
      <div>
      <button onClick={handleBackwardArrowClick}>Backward</button>
      <span>Week {format(weekStart, "MM/dd/yyyy")} - {format(weekEnd, "MM/dd/yyyy")}</span>
      <button onClick={handleForwardArrowClick}>Forward</button>
    </div>
        
        <div>
      <h1>Weekly Schedule</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Sunday</th>
            <th>Monday</th>
            <th>Tuesday</th>
            <th>Wednesday</th>
            <th>Thursday</th>
            <th>Friday</th>
            <th>Saturday</th>
          </tr>
        </thead>
        <tbody>
          {/* Render rows for each employee of the week */}
          {employeeList.map((employee, index) => (
            <tr key={index}>
              <td>{employee.username}</td>
              <td>{(isSameWeek(new Date(scheduleList[index]?.work_date), weekEnd) && isSunday(new Date(scheduleList[index]?.work_date)))?  scheduleList[index]?.start_work_hour + "-" + scheduleList[index]?.end_work_hour : ""}</td>
              <td>{(isSameWeek(new Date(scheduleList[index]?.work_date), weekEnd) && isMonday(new Date(scheduleList[index]?.work_date)))?  scheduleList[index]?.start_work_hour + "-" + scheduleList[index]?.end_work_hour : ""}</td>
              <td>{(isSameWeek(new Date(scheduleList[index]?.work_date), weekEnd) && isTuesday(new Date(scheduleList[index]?.work_date)))?  scheduleList[index]?.start_work_hour + "-" + scheduleList[index]?.end_work_hour : ""}</td>
              <td>{(isSameWeek(new Date(scheduleList[index]?.work_date), weekEnd) && isWednesday(new Date(scheduleList[index]?.work_date)))?  scheduleList[index]?.start_work_hour + "-" + scheduleList[index]?.end_work_hour : ""}</td>
              <td>{(isSameWeek(new Date(scheduleList[index]?.work_date), weekEnd) && isThursday(new Date(scheduleList[index]?.work_date)))?  scheduleList[index]?.start_work_hour + "-" + scheduleList[index]?.end_work_hour : ""}</td>
              <td>{(isSameWeek(new Date(scheduleList[index]?.work_date), weekEnd) && isFriday(new Date(scheduleList[index]?.work_date)))?  scheduleList[index]?.start_work_hour + "-" + scheduleList[index]?.end_work_hour : ""}</td>
              <td>{(isSameWeek(new Date(scheduleList[index]?.work_date), weekEnd) && isSaturday(new Date(scheduleList[index]?.work_date)))?  scheduleList[index]?.start_work_hour + "-" + scheduleList[index]?.end_work_hour : ""}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    

      </div>
  )
}

export default Admin;