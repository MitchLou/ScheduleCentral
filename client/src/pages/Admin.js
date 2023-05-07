import React, { useEffect, useState } from "react";
import Axios from "axios";
import "./Admin.css";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
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
  isSameDay,
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

  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(8); // how many users are visible in each page
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const visibleEmployeeList = employeeList.slice(startIndex, endIndex);

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
  const [department, setDepartment] = useState("");

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
    const conflicts = visibleEmployeeList.filter(hasScheduleConflict);
  }, [employeeList, visibleEmployeeList]);

  const logOut = () => {
    Axios.post("http://localhost:3001/logout").then((response) => {
      console.log(response);
      navigate("login");
    });
  };

  const getEmployees = () => {
    Axios.get("http://localhost:3001/employees").then((response) => {
      const employees = response.data;
      for (const employee of employees) {
        employee.schedules = scheduleList.filter(
          (schedule) => schedule.employee_ID === employee.id_employees
        );
      }
      setEmployeeList(employees);
      getSchedules(); // Fetch schedule list after setting employee list
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
        getEmployees();
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

  function formatTime(time) {
    // Split the time value into hours and minutes
    const [hours, minutes] = time.split(":");

    // Create a Date object and set the hours and minutes
    const formattedTime = new Date();
    formattedTime.setHours(hours);
    formattedTime.setMinutes(minutes);

    // Format the time with AM/PM
    const options = { hour: "numeric", minute: "numeric", hour12: true };
    return formattedTime.toLocaleTimeString("en-US", options);
  }

  function hasScheduleConflict(employee1, work_date, work_start, work_end) {
    const filteredEmployees = employeeList.filter(
      (employee2) =>
        employee1.position === employee2.position &&
        employee1.department === employee2.department &&
        employee1.id_employees !== employee2.id_employees
    );

    for (const employee2 of filteredEmployees) {
      const employee2Schedules = scheduleList.filter(
        (schedule) =>
          schedule.employee_ID === employee2.id_employees &&
          isSameDay(new Date(schedule.work_date), new Date(work_date))
      );

      for (const schedule of employee2Schedules) {
        if (
          (schedule.start_work_hour <= work_end &&
            schedule.end_work_hour >= work_start) || // Updated condition
          (work_start <= schedule.end_work_hour &&
            work_end >= schedule.start_work_hour) || // Updated condition
          (work_start <= schedule.start_work_hour &&
            work_end >= schedule.end_work_hour) // Updated condition
        ) {
          return {
            conflictingShift: schedule.work_date,
            conflictingEmployee: employee2,
          };
        }
      }
    }

    return false; // No conflicting shifts found
  }

  return (
    <div className="Attributes">
      <div className="header">
        <img className="pagelogo" src={require("./schedulecLOGOFINALL.png")} />
        <h1>Employee Schedules</h1>
        <div className="logout">
          <button onClick={logOut}>LOG OUT</button>
        </div>
      </div>

      <div className="EmployeeInfo">
        <Popup trigger={buttonPopup} setTrigger={setButtonPopup}>
          <label className="form-label">Full Name:</label>
          <input
            className="form-input"
            type="text"
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          <label className="form-label">Position:</label>
          <input
            className="form-input"
            type="text"
            onChange={(e) => {
              setPosition(e.target.value);
            }}
          />

          <label className="form-label" htmlFor="department">
            Department:
          </label>
          <select
            id="role"
            onChange={(e) => {
              setDepartment(e.target.value);
            }}
          >
            <option value="0"></option>
            <option value="Nursing">Nursing</option>
            <option value="Bookeeping">Bookeeping</option>
            <option value="Outpatient">Outpatient</option>
            <option value="Inpatient">Inpatient</option>
            <option value="Pharmacy">Pharmacy</option>
            <option value="Intensive Care">Intensive Care</option>
            <option value="Morgue">Morgue</option>
          </select>
          <br />
          <label className="form-label">Username:</label>
          <input
            className="form-input"
            type="text"
            onChange={(e) => {
              setUsernameReg(e.target.value);
            }}
          />
          <label className="form-label">Password:</label>
          <input
            className="form-input"
            type="text"
            onChange={(e) => {
              setPasswordReg(e.target.value);
            }}
          />

          <label className="form-label" htmlFor="Role">
            Role:
          </label>
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

          <button className="form-submit" onClick={addEmployee}>
            Add Employee
          </button>
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
            <div class="table-container">
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
                    {visibleEmployeeList.map((employee, rowIndex) => (
                      <tr key={rowIndex}>
                        <td className="day">
                          {employee.name}
                          <p className="smaller-text">{employee.role}</p>
                        </td>
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
                                employee.id_employees ===
                                  schedule.employee_ID &&
                                isSameWeek(
                                  new Date(schedule.work_date),
                                  weekEnd
                                ) &&
                                isDay(new Date(schedule.work_date))
                              ) {
                                const conflict = hasScheduleConflict(
                                  employee,
                                  schedule.work_date,
                                  schedule.start_work_hour,
                                  schedule.end_work_hour
                                );
                                const isConflict = conflict;

                                return (
                                  <div key={cellIndex}>
                                    <h4>
                                      {formatTime(schedule.start_work_hour)} -{" "}
                                      {formatTime(schedule.end_work_hour)}
                                    </h4>
                                    <div
                                      className={`hover ${
                                        isConflict ? "conflict" : ""
                                      }`}
                                    >
                                      <h4>
                                        {formatTime(schedule.start_work_hour)} -{" "}
                                        {formatTime(schedule.end_work_hour)}
                                      </h4>

                                      <p>
                                        {employee.department} -{" "}
                                        {employee.position}
                                      </p>
                                      {isConflict && (
                                        <span className="conflict-text">
                                          Conflicts with{" "}
                                          {conflict.conflictingEmployee.name}
                                        </span>
                                      )}
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
                              <label className="form-label">Date: </label>
                              <input
                                type="date"
                                placeholder="2000..."
                                onChange={(event) => {
                                  setWorkDate(event.target.value);
                                }}
                              />
                              <label className="form-label">
                                Starting Time:{" "}
                              </label>
                              <input
                                type="time"
                                placeholder="Work Start..."
                                onChange={(event) => {
                                  const inputTime = event.target.value;
                                  const [hours, minutes] = inputTime.split(":");

                                  // Create a new Date object and set the hours and minutes
                                  const time = new Date();
                                  time.setHours(hours);
                                  time.setMinutes(minutes);

                                  // Format the time as HH:MM
                                  const formattedTime = `${time.getHours()}:${time.getMinutes()}`;

                                  // Store the formatted time in MySQL or use it as needed
                                  // Send it to the server for storage or further processing

                                  setWorkStart(formattedTime); // Optionally, update the state if required
                                }}
                              />
                              <label className="form-label">
                                Ending Time:{" "}
                              </label>
                              <input
                                type="time"
                                placeholder="Work End..."
                                onChange={(event) => {
                                  const inputTime = event.target.value;
                                  const [hours, minutes] = inputTime.split(":");

                                  // Create a new Date object and set the hours and minutes
                                  const time = new Date();
                                  time.setHours(hours);
                                  time.setMinutes(minutes);

                                  // Format the time as HH:MM
                                  const formattedTime = `${time.getHours()}:${time.getMinutes()}`;

                                  // Store the formatted time in MySQL or use it as needed
                                  // Send it to the server for storage or further processing

                                  setWorkEnd(formattedTime); // Optionally, update the state if required
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
                                  const confirmBox = window.confirm(
                                    "This will remove an employee's shift from the system. Are you sure you want to proceed?"
                                  );
                                  if (confirmBox == true) {
                                    deleteDate(selectedEmployeeId, workDate);
                                  }
                                }}
                                className="delete-shift-button"
                              >
                                Delete Shift
                              </button>

                              <button
                                onClick={() => {
                                  const confirmBox = window.confirm(
                                    "This will permanently delete an employee from the system. Are you sure you want to proceed?"
                                  );
                                  if (confirmBox == true) {
                                    deleteEmployee(selectedEmployeeId);
                                  }
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
                <ReactPaginate
                  previousLabel={"Previous"}
                  nextLabel={"Next"}
                  pageCount={Math.ceil(employeeList.length / itemsPerPage)}
                  onPageChange={({ selected }) => setCurrentPage(selected)}
                  containerClassName={"pagination"}
                  activeClassName={"active"}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;
