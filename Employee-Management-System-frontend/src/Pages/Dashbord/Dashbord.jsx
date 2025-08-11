import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const navigate =useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/getEmployee");
        const data = await response.json();
        setEmployees(data);
        console.log(data);
      } catch (error) {
        console.log("Error fetching employees:", error.message);
      }
    };
    fetchEmployees();
  }, []);

  //this method is for delete the employee

   const handleDelete = async (empId) => {
    try {
      const response =await fetch(`http://localhost:8080/api/employee/${empId}`,{
       method:"DELETE",
      });

      if(response.ok){
        setEmployees((prevEmployees)=>
        prevEmployees.filter((employee)=>employee.id!==empId)
      )
      }
      console.log("Employee with id", empId, "deleted successfully");
      
    }catch(error){
      console.error("Error deleting employee",error.message)
    }
  }
  
  const handleUpdate =(empId)=>{
    navigate(`/employee/${empId}`);
  }
  return (
    <div className="max-w-6xl mx-auto mt-12 px-4">
      <h1 className="text-3xl font-bold text-center mb-6">Employees</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 text-sm text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Phone</th>
              <th className="px-4 py-2 border">Department</th>
              <th className="px-4 py-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {employees.length > 0 ? (
              employees.map((employee) => (
                <tr key={employee.id} className="bg-white hover:bg-gray-50">
                  <td className="px-4 py-2 border">{employee.name}</td>
                  <td className="px-4 py-2 border">{employee.email}</td>
                  <td className="px-4 py-2 border">{employee.phone}</td>
                  <td className="px-4 py-2 border">{employee.department}</td>
                  <td className="px-4 py-2 border space-x-2">
                    <button onClick={()=>handleUpdate(employee.id)} className="px-3 py-1 text-sm border border-gray-400 text-gray-700 rounded hover:bg-gray-100 transition">
                      Update
                    </button>
                    <button onClick={()=>handleDelete(employee.id)} className="px-3 py-1 text-sm border border-red-400 text-red-600 rounded hover:bg-red-100 transition">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="text-center text-gray-500 px-4 py-6 border">
                  No employees found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
