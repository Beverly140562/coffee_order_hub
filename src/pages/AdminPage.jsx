import React from 'react';
import AdminProduct from './AdminProduct';
import AdminHeader from './AdminHeader';
import AdminNavbar from './AdminNavbar';


function AdminPage() {
  

  return (
    <div className=" min-h-screen">

      <div className="">
        <AdminProduct showForm={false} showTable={true} />
      <AdminNavbar />
      </div>

      
    </div>
  );
}

export default AdminPage;
