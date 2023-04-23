import React, {useEffect, useState} from "react";
import Axios from "axios";
import './Admin.css'
import Popup from './Popup';
import {addDays, format, startOfWeek, endOfWeek, isSameWeek, isMonday, isTuesday, isWednesday, isThursday, isFriday, isSaturday, isSunday} from "date-fns";


function Admin() {
    const [employeeList, setEmployeeList] = useState([]);
    const [scheduleList, setScheduleList] = useState([]);
    const [weekStart, setWeekStart] = useState(startOfWeek(new Date(), {weekStartsOn: 0}));
    const [weekEnd, setWeekEnd] = useState(endOfWeek(new Date(), {weekEndsOn: 6}));
    const [updatePopup, setupdatePopup] = useState(false);


    const [workDate, setWorkDate] = useState(new Date());
    const [workStart, setWorkStart] = useState("");
    const [workEnd, setWorkEnd] = useState("");


    const[username, setUserName] = useState('');
    const[password, setPassword] = useState('');
    const[role, setRole] = useState('');
    
    
    
      const addEmployee = () =>{
    Axios.post("http://localhost:3001/create",{username, password, role})
    .then(() =>{
      console.log("success");})
    };


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

      const updateEmployee = (id) => {
        console.log(id);
        Axios.put("http://localhost:3001/update", {
          workDate: workDate,
          workStart: workStart,
          workEnd: workEnd,
          id: id,
        })
          .then((response) => {
            alert("Updated successfully!");
            getSchedules(); // Reload schedules after update
          })
          .catch((error) => {
            alert("Error occurred while updating the employee's schedule.");
            console.log(error);
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
  {employeeList.map((employee, rowIndex) => (
    <tr key={rowIndex}>
      <td>{employee.name}</td>
      {[
        { isDay: isSunday, label: "Sun" },
        { isDay: isMonday, label: "Mon" },
        { isDay: isTuesday, label: "Tue" },
        { isDay: isWednesday, label: "Wed" },
        { isDay: isThursday, label: "Thu" },
        { isDay: isFriday, label: "Fri" },
        { isDay: isSaturday, label: "Sat" },
      ].map(({ isDay, label }, columnIndex) => (
        <td key={columnIndex}>
          {scheduleList.map((schedule, cellIndex) => {
            if (
              employee.id_employees === schedule.employee_ID &&
              isSameWeek(new Date(schedule.work_date), weekEnd) &&
              isDay(new Date(schedule.work_date))
            ) {
              return (
                <div key={cellIndex}>
                  {schedule.start_work_hour}-{schedule.end_work_hour}
                </div>
              );
            } else {
              return null;
            }
          })}
        </td>
      ))}
      <td>
        
            <input
              type="date"
              placeholder="2000..."
              onChange={(event) => {
                setWorkDate(event.target.value);
              }}
            />
            <input
              type="text"
              placeholder="Work Start..."
              onChange={(event) => {
                setWorkStart(event.target.value);
              }}
            />
            <input
              type="text"
              placeholder="Work End..."
              onChange={(event) => {
                setWorkEnd(event.target.value);
              }}
            />
            <button
              onClick={() => {
                console.log(employee.id_employees);
                updateEmployee(employee.id_employees);
              }}
            >

              Update
            </button>
         
        
      </td>
    </tr>
  ))}
</tbody>
            </table>
          </div>
        </div>
          )
}


export default Admin;