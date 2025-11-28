import React from 'react';
import AdminProduct from './AdminProduct';
import AdminManage from './AdminManage';
import AdminHeader from './AdminHeader';


function AdminPage() {
  

  return (
    <div className=" min-h-screen bg-[#C7AD7F] p-1">
      {/* Header */}
      <AdminHeader />

      <div className="">
        <AdminProduct showForm={false} showTable={true} />
        <AdminManage />
      </div>
    </div>
  );
}

export default AdminPage;
