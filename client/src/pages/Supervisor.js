import React, { useEffect, useState } from "react";
import Axios from "axios";
import Popup from "./Popup";
import { useNavigate } from "react-router-dom";
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

function Supervisor() {
  let navigate = useNavigate();
  const [employeeList, setEmployeeList] = useState([]);
  const [scheduleList, setScheduleList] = useState([]);
  const [weekStart, setWeekStart] = useState(
    startOfWeek(new Date(), { weekStartsOn: 0 })
  );
  const [weekEnd, setWeekEnd] = useState(
    endOfWeek(new Date(), { weekEndsOn: 6 })
  );
  const [updatePopup, setupdatePopup] = useState(false);
  const [updatebuttonPopup, setUpdateButtonPopup] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(0);

  const [workDate, setWorkDate] = useState(new Date());
  const [workStart, setWorkStart] = useState("");
  const [workEnd, setWorkEnd] = useState("");
  const [loginInfo, setLoginInfo] = useState(0);
  const [department, setDepartment] = useState("");

  useEffect(() => {
    Axios.get("http://localhost:3001/login").then((response) => {
      if (response.data.loggedIn == true) {
        setLoginInfo(response.data.user[0].login_id);
        getDepartment(response.data.user[0].login_id);
      }
    });
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

  const getDepartment = (id) => {
    Axios.get(`http://localhost:3001/department/${id}`)
      .then((response) => {
        setDepartment(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const updateEmployee = (id) => {
    Axios.put("http://localhost:3001/update", {
      workDate: workDate,
      workStart: workStart,
      workEnd: workEnd,
      id: id,
    })
      .then((response) => {
        alert("Updated successfully!");
        getSchedules();
        if (isSameWeek(new Date(), new Date(workDate))) {
          addNotification(id);
        }
      })
      .catch((error) => {
        alert("Error occurred while updating the employee's schedule.");
        console.log(error);
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
    <div className="Attributes">
      <div>
        <button onClick={logOut}>Logout</button>
      </div>
      <div>
        <button onClick={handleBackwardArrowClick}>Backward</button>
        <span>
          Week {format(weekStart, "MM/dd/yyyy")} -{" "}
          {format(weekEnd, "MM/dd/yyyy")}
        </span>
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
            {employeeList.map((employee, rowIndex) =>
              employee.department === department[0]?.department ? (
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
                              {schedule.start_work_hour}-
                              {schedule.end_work_hour}
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
                        <button
                          className="registerButton"
                          onClick={() => {
                            setSelectedEmployeeId(employee.id_employees);
                            setUpdateButtonPopup(true);
                          }}
                        >
                          Update
                        </button>
                      </main>

                      <Popup
                        trigger={updatebuttonPopup}
                        setTrigger={setUpdateButtonPopup}
                        employeeId={selectedEmployeeId}
                      >
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
                            const value = event.target.value;
                            if (value === "") {
                              setWorkStart("");
                            } else {
                              setWorkStart(value);
                            }
                          }}
                        />
                        <input
                          type="text"
                          placeholder="Work End..."
                          onChange={(event) => {
                            const value = event.target.value;
                            if (value === "") {
                              setWorkEnd("");
                            } else {
                              setWorkEnd(value);
                            }
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
                            deleteDate(selectedEmployeeId, workDate);
                          }}
                        >
                          Delete Shift
                        </button>
                      </Popup>
                    </div>
                  </td>
                </tr>
              ) : null
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Supervisor;
