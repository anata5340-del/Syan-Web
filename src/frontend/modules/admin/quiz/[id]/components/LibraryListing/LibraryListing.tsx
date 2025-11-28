import DeleteNotification from "@/frontend/components/notifications/DeleteNotification";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Paper, Quiz } from "@/backend/types";

const addBtnStyle = {
  background: "#01B067",
  padding: "0px 15px",
  borderRadius: "5px",
};

const LiraryListing = ({
  data,
  onAdd,
  onEdit,
  onDelete,
}: {
  data: Quiz | null;
  onAdd: (data: Paper) => void;
  onEdit: (data: Paper) => void;
  onDelete: (id: string) => void;
}) => {
  const handleAdd = (data: Paper) => onAdd(data);
  const handleEdit = (data: Paper) => onEdit(data);
  const handleDelete = (id: string) => onDelete(id);

  return (
    <>
      {data?.library?.papers.map((paper) => {
        return (
          <div className="w-1/4">
            <div
              style={{ backgroundColor: paper?.color }}
              className="flex rounded-xl h-44 px-4 justify-between"
            >
              <div className="flex flex-col justify-around w-1/2">
                <h2 className="text-black text-2xl font-semibold">
                  {paper?.name}
                </h2>
                <div className="bg-colororange rounded-xl text-center text-white">
                  {paper?.topic}
                </div>
              </div>
              <div className="flex flex-col justify-center gap-5 items-center">
                <Button
                  type="primary"
                  style={addBtnStyle}
                  icon={<PlusOutlined />}
                  onClick={() => handleAdd(paper)}
                >
                  Add
                </Button>
                <img src="/assets/img/icon25.png" alt="image" />
              </div>
            </div>
            <div className="flex justify-between mt-4">
              <div></div>
              <div className="flex items-center gap-4">
                <img
                  style={{ cursor: "pointer" }}
                  src="/assets/img/icon12.png"
                  className="edit"
                  onClick={() => handleEdit(paper)}
                />
                <DeleteNotification
                  key={paper?._id}
                  onDelete={() => handleDelete(paper?._id)}
                />
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default LiraryListing;
