import React from "react";

const Table = ({ entry, setEntry }) => {
    
  const handleChange = (event, field) => {
    const newEntry = { ...entry, [field]: event.target.value };
    setEntry(newEntry);
  };

  return (
    <div className="flex justify-center">
      <table className="border-collapse border-2 border-gray-500">
        <thead>
          <tr>
            <th className="border border-gray-500 px-4 py-2">Name*</th>
            <th className="border border-gray-500 px-4 py-2">Designation*</th>
            <th className="border border-gray-500 px-4 py-2">Department*</th>
            <th className="border border-gray-500 px-4 py-2">
              Employee Code/Entry Number*
            </th>
            <th className="border border-gray-500 px-4 py-2">Mobile Number*</th>
            <th className="border border-gray-500 px-4 py-2">Email*</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-gray-500 px-4 py-2">
              <input
                type="text"
                value={entry.name}
                onChange={(event) => handleChange(event, "name")}
                className="w-full text-center"
              />
            </td>
            <td className="border border-gray-500 px-4 py-2">
              <input
                type="text"
                value={entry.designation}
                onChange={(event) => handleChange(event, "designation")}
                className="w-full text-center"
              />
            </td>
            <td className="border border-gray-500 px-4 py-2">
              <input
                type="text"
                value={entry.department}
                onChange={(event) => handleChange(event, "department")}
                className="w-full text-center"
              />
            </td>
            <td className="border border-gray-500 px-4 py-2">
              <input
                type="text"
                value={entry.code}
                onChange={(event) => handleChange(event, "code")}
                className="w-full text-center"
              />
            </td>
            <td className="border border-gray-500 px-4 py-2">
              <input
                type="text"
                value={entry.mobile}
                onChange={(event) => handleChange(event, "mobile")}
                className="w-full text-center"
              />
            </td>
            <td className="border border-gray-500 px-4 py-2">
              <input
                type="email"
                value={entry.email}
                onChange={(event) => handleChange(event, "email")}
                className="w-full text-center"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Table;
