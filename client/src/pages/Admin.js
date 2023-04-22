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
    const [buttonPopup, setButtonPopup] = useState(false);


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

      const updateEmployee = (id, oldDate, employee_ID) => {
        console.log(employee_ID);
        Axios.put("http://localhost:3001/update", { workDate: workDate,workStart: workStart, workEnd: workEnd, oldDate: oldDate, id: id, employee_ID: employee_ID }).then(
          (response) => {
            alert("updated");
          }
        );
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
            <th>Saturday</th>
          </tr>
        </thead>
        <tbody>

          {/* Render rows for each employee of the week */}
         {employeeList.map((employee, columnIndex) => (
          <tr key={columnIndex}>
            <td>{employee.name}</td>
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
                    updateEmployee(employee.id_employees);
                  }}
                >
                  {" "}
                  Update
                </button>
              </td>
            {scheduleList.map((schedule, cellIndex) => (
              employee.id_employees === schedule.employee_ID? (
              <td key={cellIndex}>
                {(isSameWeek(new Date(schedule.work_date), weekEnd) && isSunday(new Date(schedule.work_date)))?  schedule.start_work_hour + "-" + schedule.end_work_hour : ""}
                {(isSameWeek(new Date(schedule.work_date), weekEnd) && isMonday(new Date(schedule.work_date)))?  schedule.start_work_hour + "-" + schedule.end_work_hour : ""}
                {(isSameWeek(new Date(schedule.work_date), weekEnd) && isTuesday(new Date(schedule.work_date)))?  schedule.start_work_hour + "-" + schedule.end_work_hour : ""}
                {(isSameWeek(new Date(schedule.work_date), weekEnd) && isWednesday(new Date(schedule.work_date)))?  schedule.start_work_hour + "-" + schedule.end_work_hour : ""}
                {(isSameWeek(new Date(schedule.work_date), weekEnd) && isThursday(new Date(schedule.work_date)))?  schedule.start_work_hour + "-" + schedule.end_work_hour : ""}
                {(isSameWeek(new Date(schedule.work_date), weekEnd) && isFriday(new Date(schedule.work_date)))?  schedule.start_work_hour + "-" + schedule.end_work_hour : ""}
                {(isSameWeek(new Date(schedule.work_date), weekEnd) && isSaturday(new Date(schedule.work_date)))?  schedule.start_work_hour + "-" + schedule.end_work_hour : ""}
                
              </td>
            ) : null
            ))}
          </tr>
        ))}






        </tbody>
      </table>
    </div>
    


    <br></br>
    <br></br>
    <br></br>
    <div className="Information">
    <main>
        <button onClick={() => setButtonPopup(true)}>add employee</button>
        </main>
        <Popup trigger={buttonPopup} setTrigger={setButtonPopup}>
    <label>Username:</label>
    <input type= "text" onChange={(event) => {setUserName(event.target.value)}} />
    <label>Password:</label>
    <input type= "text" onChange={(event) => {setPassword(event.target.value)}} />
    <label>Role:</label>
    <input type= "text" onChange={(event) => {setRole(event.target.value)}} />
    <button onClick={addEmployee}>Add Employee</button>
    </Popup>

    </div>
      </div>
  )
}


export default Admin;