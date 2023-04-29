import React, { useEffect, useState } from "react";
import Axios from "axios";
import "./Admin.css";
import { useNavigate } from "react-router-dom";

import Popup from "./Popup";
import {
  addDays,
  format,
  startOfWeek,
  endOfWeek,
  isSameWeek,
  isMonday,
  isTuesday,
  isWednesday,
  isThursday,
  isFriday,
  isSaturday,
  isSunday,
} from "date-fns";

function Admin() {
  const [employeeList, setEmployeeList] = useState([]);
  const [scheduleList, setScheduleList] = useState([]);
  const [weekStart, setWeekStart] = useState(
    startOfWeek(new Date(), { weekStartsOn: 0 })
  );
  const [weekEnd, setWeekEnd] = useState(
    endOfWeek(new Date(), { weekEndsOn: 6 })
  );

  const [usernameReg, setUsernameReg] = useState("");
  const [passwordReg, setPasswordReg] = useState("");
  const [buttonPopup, setButtonPopup] = useState(false);
  const [updatebuttonPopup, setUpdateButtonPopup] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(0);
  let navigate = useNavigate();

  const [workDate, setWorkDate] = useState(new Date());
  const [workStart, setWorkStart] = useState("");
  const [workEnd, setWorkEnd] = useState("");

  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("");
  const [loginStatus, setLoginStatus] = useState("");
  const [role, setRole] = useState("");

  const addEmployee = () => {
    Axios.post("http://localhost:3001/register", {
      username: usernameReg,
      password: passwordReg,
      name: name,
      position: position,
      department: department,
      role: role,
    }).then((response) => {
      alert("Employee Added Successfully");
      getEmployees();
    });
  };

  useEffect(() => {
    getEmployees();
    getSchedules();
  }, []);

  const logOut = () => {
    Axios.post("http://localhost:3001/logout").then((response) => {
      console.log(response);
      navigate("login");
    });
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
        if (isSameWeek(new Date(), new Date(workDate))) {
          addNotification(id);
        }
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
    setSelectedEmployeeId(id); // Update selectedEmployeeId state
    Axios.delete(`http://localhost:3001/delete/${id}`).then((response) => {
      getEmployees();
      getSchedules();
    });
  };

  const deleteDate = (id, workDate) => {
    Axios.delete(
      `http://localhost:3001/deletedate/${id}?workDate=${workDate}`
    ).then((response) => {
      getSchedules();
      if (isSameWeek(new Date(), new Date(workDate))) {
        addNotification(id);
      }
    });
  };

  const addNotification = (id) => {
    Axios.post("http://localhost:3001/notification", {
      id: id,
    }).then((response) => {
      console.log(response);
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
    <div className="Container">
      <div className="header">
        <img className="pagelogo" src={require("./logo1116v2.png")} />
        <h1>Employee Schedules</h1>
        <div className="logout">
          <button onClick={logOut}>LOG OUT</button>
        </div>
      </div>

      <div className="EmployeeInfo">
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

          <label htmlFor="department">Department:</label>
          <select
            id="department"
            onChange={(e) => {
              setDepartment(e.target.value);
            }}
          >
            <option value="0"></option>
            <option value="Nursing">Nursing</option>
            <option value="Bookeeping">Bookeeping</option>
            <option value="HR">HR</option>
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
          <select
            id="Role"
            onChange={(e) => {
              setRole(e.target.value);
            }}
          >
            <option value="0"></option>
            <option value="admin">Admin</option>
            <option value="supervisor">Supervisor</option>
            <option value="employee">Employee</option>
          </select>
          <button onClick={addEmployee}>Add Employee</button>
        </Popup>
      </div>

      <div>
        <div className="container">
          <button className="addEmployee" onClick={() => setButtonPopup(true)}>
            Add Employee
          </button>

          <div className="week-picker">
            <button className="arrow-button" onClick={handleBackwardArrowClick}>
              <img
                src={require("./icons8-left-64.png")}
                alt="Button Image"
                className="backward-arrow"
              />
            </button>
            <span className="week-span">
              Week {format(weekStart, "MM/dd/yyyy")} -{" "}
              {format(weekEnd, "MM/dd/yyyy")}
            </span>
            <button className="arrow-button" onClick={handleForwardArrowClick}>
            <img
                src={require("./icons8-right-64.png")}
                alt="Button Image"
                className="forward-arrow"
              />
            </button>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12">
            <div className="schedule-table">
              <table className="table bg-white">
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
                    <th className="last"></th>
                  </tr>
                </thead>
                <tbody>
                  {/* Render rows for each employee of the week */}
                  {employeeList.map((employee, rowIndex) => (
                    <tr key={rowIndex}>
                      <td className="day">{employee.name}</td>
                      {[
                        { isDay: isSunday, label: "Sun" },
                        { isDay: isMonday, label: "Mon" },
                        { isDay: isTuesday, label: "Tue" },
                        { isDay: isWednesday, label: "Wed" },
                        { isDay: isThursday, label: "Thu" },
                        { isDay: isFriday, label: "Fri" },
                        { isDay: isSaturday, label: "Sat" },
                      ].map(({ isDay, label }, columnIndex) => (
                        <td className="active" key={columnIndex}>
                          {scheduleList.map((schedule, cellIndex) => {
                            if (
                              employee.id_employees === schedule.employee_ID &&
                              isSameWeek(
                                new Date(schedule.work_date),
                                weekEnd
                              ) &&
                              isDay(new Date(schedule.work_date))
                            ) {
                              return (
                                <div key={cellIndex}>
                                  <h4>
                                    {schedule.start_work_hour}-
                                    {schedule.end_work_hour}
                                  </h4>
                                  <div className="hover">
                                    <h4>
                                      {schedule.start_work_hour}-
                                      {schedule.end_work_hour}
                                    </h4>
                                    <p>
                                      {employee.department} -{" "}
                                      {employee.position}
                                    </p>

                                    <span>{employee.name}</span>
                                  </div>
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
                          <button
                            className="imageButton"
                            onClick={() => {
                              setSelectedEmployeeId(employee.id_employees);
                              setUpdateButtonPopup(true);
                            }}
                          >
                            <img
                              src={require("./icons8-create-64.png")}
                              alt="Button Image"
                              className="button-image"
                            />
                          </button>

                          <Popup
                            trigger={updatebuttonPopup}
                            setTrigger={setUpdateButtonPopup}
                            employeeId={selectedEmployeeId}
                          >
                            <label className="popup-headers">
                              Availability
                            </label>
                            <br />
                            <label>Date: </label>
                            <input
                              type="date"
                              placeholder="2000..."
                              onChange={(event) => {
                                setWorkDate(event.target.value);
                              }}
                            />
                            <label>Starting Time: </label>
                            <input
                              type="time"
                              placeholder="Work Start..."
                              onChange={(event) => {
                                const time = new Date();
                                time.setHours(event.target.value.split(":")[0]);
                                time.setMinutes(
                                  event.target.value.split(":")[1]
                                );
                                const workStart = time.toLocaleTimeString(
                                  "en-US",
                                  { hour: "numeric", minute: "numeric" }
                                );
                                setWorkStart(workStart);
                              }}
                            />
                            <label>Ending Time: </label>
                            <input
                              type="time"
                              placeholder="Work End..."
                              onChange={(event) => {
                                const time = new Date();
                                time.setHours(event.target.value.split(":")[0]);
                                time.setMinutes(
                                  event.target.value.split(":")[1]
                                );
                                const workEnd = time.toLocaleTimeString(
                                  "en-US",
                                  {
                                    hour: "numeric",
                                    minute: "numeric",
                                  }
                                );
                                setWorkEnd(workEnd);
                              }}
                            />
                            <button
                              onClick={() => {
                                updateEmployee(selectedEmployeeId);
                              }}
                              className="popup-buttons buttonsHover"
                            >
                              UPDATE SHIFT
                            </button>
                            <br />
                            <br />

                            <label
                              htmlFor="UpdateRole"
                              className="popup-headers"
                            >
                              Role
                            </label>

                            <select
                              id="UpdateRole"
                              onChange={(e) => {
                                setRole(e.target.value);
                              }}
                            >
                              <option value="0"></option>
                              <option value="admin">Admin</option>
                              <option value="supervisor">Supervisor</option>
                              <option value="employee">Employee</option>
                            </select>

                            <button
                              onClick={() => {
                                updateRole(selectedEmployeeId);
                              }}
                              className="popup-buttons buttonsHover"
                            >
                              ASSIGN ROLE
                            </button>

                            <button
                              onClick={() => {
                                deleteDate(selectedEmployeeId, workDate);
                              }}
                              className="delete-shift-button"
                            >
                              Delete Shift
                            </button>

                            <button
                              onClick={() => {
                                deleteEmployee(selectedEmployeeId);
                              }}
                              className="delete-employee-button"
                            >
                              Delete Employee
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
        </div>
      </div>
    </div>
  );
}

export default Admin;
