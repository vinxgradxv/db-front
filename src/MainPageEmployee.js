import logo from './logo.svg';
import taskLogo from './icons/icons8-task-50.png';
import adminLogo from './icons/icons8-admin-50.png';
import courseLogo from './icons/icons8-book-50.png';
import productivityLogo from './icons/icons8-chart-50.png';
import employeeLogo from './icons/icons8-employee-50.png';
import foodLogo from './icons/icons8-kawaii-broccoli-50.png';
import equipmentLogo from './icons/icons8-laptop-50.png';
import dayoffLogo from './icons/icons8-palm-tree-50.png';
import workTimeLogo from './icons/icons8-watch-50.png';
import itmoLogo from './icons/logo_osnovnoy_russkiy_chernyy.png'


import './App.css';
import EmployeeTable from "./tables/EmployeeTable";
import ProductivityStatisticsTable from "./tables/ProductivityStatisticsTable";
import {useState} from "react";
import AdminTable from "./tables/AdminTable";
import CourseTable from "./tables/CourseTable";
import DayOffRequestTable from "./tables/DayOffRequestTable";
import EnterpriseEquipmentTable from "./tables/EnterpriseEquipmentTable";
import WorkTimeTable from "./tables/WorkTimeTable";
import FoodCompensationTable from "./tables/FoodCompensationTable";
import TaskTable from "./tables/TaskTable";
import CourseEnrollmentTable from "./tables/CourseEnrollmentTable";
import EnterpriseEquipmentPossessionTable from "./tables/EnterpriseEquipmentPossessionTable";

function MainPageEmployee() {

  const [component, setComponent] = useState('');

  const handleClickProductivity = () => {
    setComponent('ProductivityStatisticsTable');
  };

  const handleClickAdmin = () => {
    setComponent('AdminTable');
  };

  const handleClickCourse = () => {
    setComponent('CourseTable');
  };

  const handleClickCourseEnrollment = () => {
    setComponent('CourseEnrollmentTable');
  };

  const handleClickDayOff = () => {
    setComponent('DayOffRequestTable');
  };

  const handleClickEnterpriseEquipmentPossession = () => {
    setComponent('EnterpriseEquipmentPossessionTable');
  };

  const handleClickTask = () => {
    setComponent('TaskTable');
  };

  let ComponentToRender;

  switch(component) {
    case 'CourseTable':
      ComponentToRender = <CourseTable />;
      break;
    case 'CourseEnrollmentTable':
      ComponentToRender = <CourseEnrollmentTable/>;
      break;
    case 'AdminTable':
      ComponentToRender = <AdminTable />;
      break;
    case 'DayOffRequestTable':
      ComponentToRender = <DayOffRequestTable />;
      break;
    case 'EnterpriseEquipmentPossessionTable':
      ComponentToRender = <EnterpriseEquipmentPossessionTable />;
      break;
    case 'TaskTable':
      ComponentToRender = <TaskTable />;
      break;
    case 'ProductivityStatisticsTable':
      ComponentToRender = <ProductivityStatisticsTable />;
      break;
    default:
      ComponentToRender = null;
  }


  return (
    <div className="App">
      <header className="App-header">
        <img src={itmoLogo} className="itmo-logo" alt="logo" />
        <p>
          Trofimchenko P34111 Vinogradov
        </p>
      </header>
      <div className="sidenav">
        <TaskButton onClick={handleClickTask}></TaskButton>
        <AdminButton onClick={handleClickAdmin} o></AdminButton>
        <CourseButton onClick={handleClickCourse}></CourseButton>
        <CourseEnrollmentButton onClick={handleClickCourseEnrollment}></CourseEnrollmentButton>
        <ProductivityButton onClick={handleClickProductivity}></ProductivityButton>
        <EquipmentPossessionButton onClick={handleClickEnterpriseEquipmentPossession}></EquipmentPossessionButton>
        <DayoffButton onClick={handleClickDayOff}></DayoffButton>
      </div>
      <div className="div-table">
        {ComponentToRender}
      </div>
    </div>
  );

  function TaskButton({onClick}) {
    return (
        <button onClick={onClick}><img src={taskLogo} alt="Tasks"/></button>
    );
  }

  function ProductivityButton({onClick}) {
    return (
        <button onClick={onClick}><img src={productivityLogo} alt="ProductivityStatistics"/></button>
    );
  }

  function AdminButton({onClick}) {
    return (
        <button onClick={onClick}><img src={adminLogo} alt="AdminButton"/></button>
    );
  }

  function CourseButton({onClick}) {
    return (
        <button onClick={onClick}><img src={courseLogo} alt="CourseButton"/></button>
    );
  }

  function CourseEnrollmentButton({onClick}) {
    return (
        <button onClick={onClick}><img src={courseLogo} alt="CourseEnrollmentButton"/></button>
    );
  }

  function EquipmentPossessionButton({onClick}) {
    return (
        <button onClick={onClick}><img src={equipmentLogo} alt="EquipmentPossessionButton"/></button>
    );
  }

  function DayoffButton({onClick}) {
    return (
        <button onClick={onClick}><img src={dayoffLogo} alt="DayoffButton"/></button>
    );
  }
}
export default MainPageEmployee;
