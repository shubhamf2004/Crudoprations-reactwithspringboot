import React, { useEffect } from 'react'
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
const UpdateUser = () => {
    const {id}=useParams();
    const navigate=useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        department: "",
    });
    
    
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        })
    };

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/employee/${id}`)
                const data = await response.json();
                setFormData(data);
                console.log(data);
            } catch (error) {
                console.error("User fetching error",error);
            }
        }
        fetchEmployees();

    },[id])

    const handleSubmit =async(e)=>{
        e.preventDefault();

        try{
            const response =await fetch(`http://localhost:8080/api/employee/${id}`,{
                method: 'PATCH',
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify(formData),
            });
            const data = await response.json();
            console.log("User Updated",data);
            navigate("/view");
        }catch(error){
             console.error("Error updating user:",error);
        }
    }
    return (
        <>
            <div className="flex flex-col items-center justify-center h-[90vh] bg-gray-100">
                <form onSubmit={handleSubmit} className="w-full  max-w-md p-4 border border-gray-300 bg-white rounded shadow-md text-center">
                    <p className="text-xl font-bold mb-6">Update employee</p>

                    <input
                        type="text"
                        name="name"
                        placeholder="Enter name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Enter email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <input
                        type="text"
                        name="phone"
                        placeholder="Enter phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <input
                        type="text"
                        name="department"
                        placeholder="Enter department"
                        value={formData.department}
                        onChange={handleInputChange}
                        className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />

                    <button
                        type="submit"
                        className="w-full bg-gray-600 text-white font-semibold py-2 rounded hover:bg-gray-400 transition"
                    >
                        Edit Employee
                    </button>
                </form>
            </div>
        </>
    )
}

export default UpdateUser
