import React, { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl } from "../config";
import SessionDetailModal from "./SessionDetailModal";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";
import { Calendar, Users, Trophy, Trash2, Edit2 } from "lucide-react";

const AdminSessionsPage = ({ players }) => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState(null);

  // Fetch all sessions
  const fetchSessions = async () => {
    try {
      const response = await axios.get(`${backendUrl.replace('/players', '/sessions')}`);
      setSessions(response.data);
    } catch (error) {
      console.error("Error fetching sessions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  // Create new session
  const handleCreateSession = async () => {
    try {
      const response = await axios.post(`${backendUrl.replace('/players', '/sessions')}`);
      setSessions([response.data, ...sessions]); // Add to top of list
      // Auto-open the new session
      setSelectedSession(response.data);
      setIsEditMode(false);
      setShowModal(true);
    } catch (error) {
      console.error("Error creating session:", error);
      alert("Failed to create session. Please try again.");
    }
  };

  // Open session for viewing/editing
  const handleSessionClick = (session) => {
    console.log("Session clicked:", session.name);
    setSelectedSession(session);
    setIsEditMode(false);
    setShowModal(true);
  };

  // Edit session
  const handleEditSession = (session) => {
    console.log("Edit button clicked:", session.name);
    setSelectedSession(session);
    setIsEditMode(true);
    setShowModal(true);
  };

  // Close modal and refresh sessions
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedSession(null);
    setIsEditMode(false);
    fetchSessions(); // Refresh list
  };

  // Handle delete button click
  const handleDeleteClick = (e, session) => {
    e.stopPropagation(); // Prevent card click
    setSessionToDelete(session);
    setShowDeleteConfirm(true);
  };

  // Confirm delete
  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`${backendUrl.replace('/players', '/sessions')}/${sessionToDelete._id}`);
      setSessions(sessions.filter(s => s._id !== sessionToDelete._id));
      setShowDeleteConfirm(false);
      setSessionToDelete(null);
    } catch (error) {
      console.error("Error deleting session:", error);
      alert("Failed to delete session. Please try again.");
    }
  };

  // Cancel delete
  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setSessionToDelete(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-lg">Loading sessions...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Session Management</h2>
          <p className="text-gray-600 text-sm">Create and manage football sessions</p>
        </div>
        <Button onClick={handleCreateSession} className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Create New Session
        </Button>
      </div>

      {/* Sessions List */}
      {sessions.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-gray-500 mb-4">No sessions yet. Create your first session!</p>
          <Button onClick={handleCreateSession}>Create Session</Button>
        </Card>
      ) : (
        <div className="space-y-3">
          {sessions.map((session) => (
            <Card
              key={session._id}
              className="p-4 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleSessionClick(session)}
            >
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-1">{session.name}</h3>
                  <div className="flex gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{session.totalAttendees} attendees</span>
                    </div>
                    {session.numberOfTeams > 0 && (
                      <div className="flex items-center gap-1">
                        <Trophy className="w-4 h-4" />
                        <span>{session.numberOfTeams} teams</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      {new Date(session.date).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditSession(session);
                    }}
                    className="p-2 text-blue-500 hover:bg-blue-50 rounded transition-colors"
                    title="Edit session"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={(e) => handleDeleteClick(e, session)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors"
                    title="Delete session"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && sessionToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
            <h3 className="text-lg font-semibold mb-2">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete session <span className="font-semibold">{sessionToDelete.name}</span>? 
              This will also update player attendance and win counts. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 border rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Session Detail Modal */}
      {showModal && selectedSession && (
        <SessionDetailModal
          session={selectedSession}
          players={players}
          isEditMode={isEditMode}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default AdminSessionsPage;
