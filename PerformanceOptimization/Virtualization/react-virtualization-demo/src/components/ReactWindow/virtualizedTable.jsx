import React from "react";
import { Table } from "antd";
import { FixedSizeList as List } from "react-window";

const columns = [
  { title: "ID", dataIndex: "id", width: 100 },
  { title: "Name", dataIndex: "name", width: 200 },
  { title: "Email", dataIndex: "email", width: 300 },
];

const data = Array.from({ length: 1000 }).map((_, i) => ({
  key: i,
  id: i,
  name: `User ${i}`,
  email: `user${i}@mail.com`,
}));

const VirtualBody = ({ children }) => {
  const rowHeight = 40;

  return (
    <List
      height={400}
      itemCount={children.length}
      itemSize={rowHeight}
      width="100%"
    >
      {({ index, style }) => (
        <div style={style}>{children[index]}</div>
      )}
    </List>
  );
};

export default function VirtualTable() {
  return (
    <Table
      columns={columns}
      dataSource={data}
      pagination={{ pageSize: 75 }}
      components={{
        body: VirtualBody,
      }}
    />
  );
}