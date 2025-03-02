example use of the apis

import React from "react";
import { useMutation } from "@tanstack/react-query";
import apis from "@/api";

const EmployeeForm = () => {
const { mutate: addEmployee, isLoading } = useMutation({
mutationFn: (data) => apis.addNewEmployee(data),
onSuccess: () => alert("Employee added!"),
onError: (error) => alert("Failed to add employee."),
});

const handleSubmit = (data) => addEmployee(data);

return <button onClick={handleSubmit}>Add Employee</button>;
};
