import ContentTable from "@/frontend/components/table/contentTable";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Input, Select } from "antd";
import AddVideos from "./add-videos";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useCategories } from "../useCategories";
import { Category } from "@/backend/types";
import AddCategories from "../AddCategories";

const addBtnStyle = {
  color: "#4F4F4F",
  background: "#FAB683",
  padding: "15px 20px",
  borderRadius: "5px",
};

export default function Videos() {
  const filterOption = (
    input: string,
    option?: { label: string; value: string }
  ) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  const [videos, setVideos] = useState<
    { id: string; name: string; date: string; categories: Category[] }[]
  >([]);
  const { categories, refetchCategories } = useCategories();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [filteredVideos, setFilteredVideos] = useState(videos);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  const getVideos = () => {
    axios
      .get<{
        videos: {
          _id: string;
          name: string;
          createdAt: string;
          categories: { name: string }[];
        }[];
      }>("/api/videos")
      .then((res) =>
        setVideos(
          res.data.videos.map((video) => ({
            ...video,
            id: video._id,
            date: video.createdAt,
            category: video.categories.join(","),
          }))
        )
      )
      .catch((error) => {
        console.error(error);
        toast.error("Failed to Fetch Videos");
      });
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null); // State for the clicked note
  const [mode, setMode] = useState(""); // State for the clicked note

  const handleToggleVideoModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  const handleVideoEdit = (video) => {
    setSelectedVideo(video); // Store the note data for editing
    setMode("Edit");
    handleToggleVideoModal();
  };

  const handleVideoView = (video) => {
    setSelectedVideo(video); // Store the note data for viewing
    setMode("View");
    handleToggleVideoModal();
  };

  const handleDelete = (id: string) => {
    axios
      .delete(`/api/videos/${id}`)
      .then(() => {
        setVideos((previous) => previous.filter((video) => video.id != id));
        toast.success("Video Deleted Successfully");
      })
      .catch((error) => {
        console.error(error);
        toast.error("Video Deletion Failed");
      });
  };

  useEffect(() => getVideos(), []);

  useEffect(() => {
    const filtered = videos.filter((video) => {
      const categoriesMap = video.categories?.map((category) => category.name);
      const matchesQuery = video.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        filterCategory === "All" || categoriesMap?.includes(filterCategory);

      return matchesQuery && matchesCategory;
    });
    setFilteredVideos(filtered);
  }, [searchQuery, videos, filterCategory]);

  return (
    <>
      <div className="flex justify-between mt-2 mb-5">
        <AddCategories
          isModalOpen={showModal}
          categories={categories}
          toggleModal={() => {
            setShowModal((prev) => !prev);
          }}
          refetch={refetchCategories}
        />
        <div className="flex">
          <p className="text-black text-2xl">List of all videos</p>
        </div>
        <div className="flex gap-20">
          <Input
            className="userSearch"
            onChange={(e) => {
              const value = e.target.value;
              setSearchQuery(value);
            }}
            style={{ width: 250 }}
            prefix={<SearchOutlined style={{ fontSize: "20px" }} />}
            suffix={"Search"}
          />
          <div>
            <Select
              className="quizCategory"
              showSearch
              placeholder="Category"
              onChange={(value) => setFilterCategory(value)}
              optionFilterProp="children"
              filterOption={filterOption}
              options={[
                {
                  label: "All",
                  value: "All",
                },
                ...categories.map((category) => ({
                  label: category.name,
                  value: category.name,
                })),
              ]}
            />
            <Button
              type="primary"
              onClick={() => {
                setShowModal(true);
              }}
              style={addBtnStyle}
              icon={<PlusOutlined />}
            ></Button>
          </div>
        </div>
        <div>
          <AddVideos
            refetch={getVideos}
            isModalOpen={isModalOpen}
            onToggle={handleToggleVideoModal}
            mode={mode}
            setMode={setMode}
            selectedVideo={selectedVideo}
            setSelectedVideo={setSelectedVideo}
          />
        </div>
      </div>
      <div>
        <ContentTable
          onDelete={handleDelete}
          dataSource={filteredVideos}
          onEdit={handleVideoEdit} // Pass the handleQuestionEdit callback
          onView={handleVideoView} // Pass the handleQuestionView callback
        />
      </div>
    </>
  );
}
