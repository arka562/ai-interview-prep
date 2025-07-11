import React, { useState, useEffect } from "react";
import { LuPlus } from "react-icons/lu";
import moment from "moment";
import axiosInstance from "../../utils/axiosInstance"; // or wherever it's defined
import { API_ROUTES } from "../../utils/apiPaths"; // or correct path
import { useNavigate } from "react-router-dom";
import { CARD_BG } from "../../utils/data";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import SummaryCard from "../../components/Cards/SummaryCard";
import Modal from "../../components/Modal";
import CreateSessionForm from "./CreateSessionForm";

const Dashboard = () => {
  const navigate = useNavigate();

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    open: false,
    data: null,
  });

  const fetchAllSession = async () => {
    try {
      const response = await axiosInstance.get(API_ROUTES.GET_MY_SESSIONS);
      setSessions(response.data);
    } catch (error) {
      console.error("Error fetching sessions", error);
    }
  };

  const deleteSession = async (id) => {
    try {
      // TODO: Replace with actual API call
      // await axios.delete(`/api/sessions/${id}`);
      // fetchAllSession();
    } catch (error) {
      console.error("Error deleting session", error);
    }
  };

  useEffect(() => {
    fetchAllSession();
  }, []);

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Your Sessions</h1>
        <button
          className="h-12 md:h-12 flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white px-4 py-2 rounded-xl shadow hover:opacity-90 transition"
          onClick={() => setOpenCreateModal(true)}
        >
          <LuPlus className="text-2xl text-white" />
          Add New
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sessions?.map((data, index) => (
          <SummaryCard
            key={data?._id}
            colors={CARD_BG[index % CARD_BG.length]}
            role={data?.role || ""}
            topicsToFocus={data?.topicsToFocus || ""}
            experience={data?.experience || "-"}
            questions={data?.questions?.length || "-"}
            description={data?.description || ""}
            lastUpdated={
              data?.updatedAt
                ? moment(data.updatedAt).format("Do MMM YYYY")
                : ""
            }
            onSelect={() => navigate(`/interview-prep/${data?._id}`)}
            onDelete={() => setOpenDeleteAlert({ open: true, data })}
          />
        ))}
      </div>

      <Modal
        isOpen={openCreateModal}
        onClose={() => {
          setOpenCreateModal(false);
        }}
        hideHeader
      >
        <div>
          <CreateSessionForm />
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default Dashboard;
