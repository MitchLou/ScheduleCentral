import React, { useEffect, useState } from "react";
import Axios from "axios";
import "./Employee.css";
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
  setDate,
} from "date-fns";

function Employee() {
  let navigate = useNavigate();
  const [employeeList, setEmployeeList] = useState([]);
  const [scheduleList, setScheduleList] = useState([]);
  const [notificationList, setNotificationList] = useState([]);
  const [weekStart, setWeekStart] = useState(
    startOfWeek(new Date(), { weekStartsOn: 0 })
  );
  const [weekEnd, setWeekEnd] = useState(
    endOfWeek(new Date(), { weekEndsOn: 6 })
  );
  const [loginInfo, setLoginInfo] = useState("");
  const [employeeID, setEmployeeID] = useState("");
  const [buttonPopup, setButtonPopup] = useState(false);

  useEffect(() => {
    Axios.get("http://localhost:3001/login").then((response) => {
      if (response.data.loggedIn == true) {
        setLoginInfo(response.data.user[0].login_id);
        getEmployeeID(response.data.user[0].login_id);
      }
    });
    getEmployees();
    getSchedules();
    getNotifications();
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

  const getEmployeeID = (id) => {
    Axios.get(`http://localhost:3001/employee/${id}`)
      .then((response) => {
        setEmployeeID(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getSchedules = () => {
    Axios.get("http://localhost:3001/schedule").then((response) => {
      setScheduleList(response.data);
    });
  };

  const getNotifications = () => {
    Axios.get("http://localhost:3001/notificationrecieve").then((response) => {
      setNotificationList(response.data);
    });
  };

  const deleteNotifications = (id) => {
    Axios.delete(`http://localhost:3001/deletenoti/${id}`).then(
      (response) => {}
    );
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

  return (
    <div className="Attributes">
      <div className="header">
        <img className="pagelogo" src={require("./logo1116v2.png")} />
        <h1>My Schedule</h1>
        <div className="logout">
          <button onClick={logOut}>LOG OUT</button>
        </div>
      </div>

      <div className="container">
        <button
          className="registerButton"
          onClick={() => {
            setButtonPopup(true);
          }}
        >
          Notifications
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

      <div className="Information">
        <Popup trigger={buttonPopup} setTrigger={setButtonPopup}>
          <div>
            {notificationList.filter(
              (notification) =>
                notification.employee_ID === employeeID.id_employees
            ).length > 0 ? (
              <div>
                <h1>You have notifications</h1>
                <ul>
                  {notificationList.map((notification, index) =>
                    notification.employee_ID === employeeID.id_employees ? (
                      <li key={index}>
                        {notification.message} ({notification.date})
                      </li>
                    ) : null
                  )}
                </ul>

                <button
                  onClick={() => {
                    deleteNotifications(employeeID.id_employees);
                  }}
                >
                  Delete Notifications
                </button>
              </div>
            ) : (
              <div>
                <h1>No notifications</h1>
              </div>
            )}
          </div>
        </Popup>
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
                  <th className="last">Saturday</th>
                </tr>
              </thead>
              <tbody>
                {/* Render rows for each employee of the week */}
                {employeeList.map((employee, rowIndex) =>
                  employee.login_ID === loginInfo ? (
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
                    </tr>
                  ) : null
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Employee;
