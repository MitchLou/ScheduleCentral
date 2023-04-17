import React, {useEffect, useState} from "react";
import Axios from "axios";
import './Admin.css'
import {addDays, format, startOfWeek, endOfWeek, isSameWeek, isMonday, isTuesday, isWednesday, isThursday, isFriday, isSaturday, isSunday} from "date-fns";

function Admin() {
    const [employeeList, setEmployeeList] = useState([]);
    const [scheduleList, setScheduleList] = useState([]);
    const [weekStart, setWeekStart] = useState(startOfWeek(new Date(), {weekStartsOn: 0}));
    const [weekEnd, setWeekEnd] = useState(endOfWeek(new Date(), {weekEndsOn: 6}));
    const [loginInfo, setLoginInfo] = useState('');


    const[name, setName] = useState('');
    const[address, setAddress] = useState('');
    const[username, setUsername] = useState('');
    const[password, setPassword] = useState('');
    const[phonenumber,setPhonenumber]= useState('0');
    const[department,setDepartment]= useState('');
    
    const displayInfo = () => {
      console.log(name + address + username + password + phonenumber + department);
    };
    
    
      const addEmployee = () =>{
    Axios.post("http://localhost:3001/create",{name:name, address:address, username:username, 
    password:password, phonenumber:phonenumber, department:department})
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
    




    <h3>{loginInfo}</h3>
    <h3>Admin</h3>
    <br></br>
    <br></br>
    <br></br>
    <div className="Information">
    <label>Name:</label>
    <input type= "text" onChange={(event) => {setName(event.target.value)}} />
    <label>Address:</label>
    <input type= "text" onChange={(event) => {setAddress(event.target.value)}} />
    <label>Username:</label>
    <input type= "text" onChange={(event) => {setUsername(event.target.value)}} />
    <label>Password:</label>
    <input type= "text" onChange={(event) => {setPassword(event.target.value)}} />
    <label>Phone Number:</label>
    <input type= "number" onChange={(event) => {setPhonenumber(event.target.value)}} />
    <label>Department:</label>
    <input type= "text" onChange={(event) => {setDepartment(event.target.value)}} />
    <button onClick={addEmployee}>Add Employee</button>


    </div>
      </div>
  )
}


export default Admin;