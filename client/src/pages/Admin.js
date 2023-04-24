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

    const [usernameReg, setUsernameReg] = useState("");
    const [passwordReg, setPasswordReg] = useState("");
    const [buttonPopup, setButtonPopup] = useState(false);
    const [updatebuttonPopup, setUpdateButtonPopup] = useState(false);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState(0);


    const [workDate, setWorkDate] = useState(new Date());
    const [workStart, setWorkStart] = useState("");
    const [workEnd, setWorkEnd] = useState("");


    const[name, setName] = useState('');
    const[position, setPosition] = useState('');
    const[username, setUsername] = useState('');
    const[password, setPassword] = useState('');
    const[phonenumber, setPhonenumber]= useState('0');
    const[department, setDepartment]= useState('');
    const [loginStatus, setLoginStatus] = useState("");
    const[role, setRole] = useState('');
    
    
    
      const addEmployee = () => {
        Axios.post("http://localhost:3001/register", {
          username: usernameReg,
          password: passwordReg,
          name: name,
          position: position,
          phonenumber: phonenumber,
          department: parseInt(department),
          role: role,
        }).then((response) => {
          console.log(response);
        });
      };

      useEffect(() => {
        getEmployees();
        getSchedules();
      }, []);



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

      const updateRole = (id) => {
        Axios.put("http://localhost:3001/role", {
          role: role,
          id: id,
        })
          .then((response) => {
            alert("Updated successfully!");
            getSchedules();
          })
          .catch((error) => {
            alert("Error occurred while updating the employee's role.");
            console.log(error);
          });
      };

      const deleteEmployee = (id) => {
        Axios.delete(`http://localhost:3001/delete/${id}`).then((response) => {
          setEmployeeList(
            employeeList.filter((val) => {
              console.log(response);
              return val.id != id;
            })
          );
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
            
          <div className="Information">
      <main>
        <button className='registerButton' onClick={() => setButtonPopup(true)}>Add Employee</button>
        </main>
        <Popup trigger={buttonPopup} setTrigger={setButtonPopup}>
        <label>Full Name:</label>
        <input
          type="text"
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        <label>Position:</label>
        <input
          type="text"
          onChange={(e) => {
            setPosition(e.target.value);
          }}
        />
        <label>Phone #:</label>
        <input
          type="text"
          onChange={(e) => {
            setPhonenumber(e.target.value);
          }}
        />
        <label htmlFor="department">Department:</label>
        <select id="department" onChange={(e) => {
        setDepartment(e.target.value);
          }}>
        <option value="0"></option>
        <option value="1">Nursing</option>
        <option value="2">Bookeeping</option>
        <option value="3">HR</option>
        </select>
        <label>Username</label>
        <input
          type="text"
          onChange={(e) => {
            setUsernameReg(e.target.value);
          }}
        />
        <label>Password</label>
        <input
          type="text"
          onChange={(e) => {
            setPasswordReg(e.target.value);
          }}
        />
        <label htmlFor="Role">Role:</label>
        <select id="Role" onChange={(e) => {
        setRole(e.target.value);
          }}>
        <option value="0"></option>
        <option value="admin">Admin</option>
        <option value="supervisor">Supervisor</option>
        <option value="employee">Employee</option>
        </select>
        <button onClick={addEmployee}>Add Employee</button>
   
    
    </Popup>
    
  

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
      <div className="Information">
      <main>
        
      <button className='registerButton' onClick={() => {
  setSelectedEmployeeId(employee.id_employees);
  setUpdateButtonPopup(true);
}}>
  Update
</button>

        </main>
        
        <Popup trigger={updatebuttonPopup} setTrigger={setUpdateButtonPopup} employeeId={selectedEmployeeId}>
            
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
                updateEmployee(selectedEmployeeId);
              }}
            >

              Update
            </button>

            <button
                  onClick={() => {
                    deleteEmployee(selectedEmployeeId);
                  }}
                >
                  Delete Employee
                </button>
                
                <label htmlFor="UpdateRole">Role:</label>
                <select id="UpdateRole" onChange={(e) => {
                  setRole(e.target.value);
                   }}>
        <option value="0"></option>
        <option value="admin">Admin</option>
        <option value="supervisor">Supervisor</option>
        <option value="employee">Employee</option>
        </select>

        <button
                  onClick={() => {
                    updateRole(selectedEmployeeId);
                  }}
                >
                  Update Role
                </button>

                </Popup>
    
  

    </div>
         
        
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