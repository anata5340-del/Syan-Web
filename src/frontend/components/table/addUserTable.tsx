'use client'

import { Button, Checkbox, Table} from "antd";

const dataSource = [
    {
      key: '1',
      id: '1001',
      name: 'Ali Nawaz',
      phone: '03001234567',
      date: '12-12-2021',
      college: 'University of the Punjab',
      city: 'Islamabad',
      jobstatus: 'Employed',
      email: 'ali@gmail.com',
    },
    {
      key: '2',
      id: '1003',
      name: 'Mohsin Nawaz',
      phone: '03001234567',
      date: '12-12-2021',
      college: 'FAST',
      city: 'Islamabad',
      jobstatus: 'Employed',
      email: 'ali@gmail.com',
    },
  ];


export default function AddUserTable(props:any) {
  const condition = props.condition;
  
  const columns = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: '1',
      width:30,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: '2',
      width:180,
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: '3',
      width:100,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: '4',
      width:100,
    },
    {
      title: 'College',
      dataIndex: 'college',
      key: '5',
      width:200,
    },
    {
      title: 'Job Status',
      dataIndex: 'jobstatus',
      key: '6',
      width:100,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: '7',
      width:150,
    },
    {
      title: 'Add',
      render: (_record: any) => { return (<><Checkbox></Checkbox></>) },
      key: '11',
      width:20,
      align: 'center',
    },
    
  ];
  
  return(
    <>
      <Table dataSource={dataSource} columns={columns} bordered={true} pagination={false}/>
    </>
  )
}