import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { setWorkspaceId } from "../../redux/slackSlice";

const workSpace = () => {
  const [workspaceName, setWorkspaceName] = useState("");
  const [workspace, setWorkspace] = useState([]); // New state for workspace list
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalValue, setModalValue] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    fetchWorkspace();

    const token = localStorage.getItem("token");
    if (token) {
      console.log("User is logged in");
    }
  }, []);

  const fetchWorkspace = async () => {
    try {
      const response = await axios.get("https://api.swaglack.site/api/workspace", {
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("Authorization"),
        },
      });
      console.log(response.data);
      setWorkspace(response.data); // Save the fetched workspaces to state
    } catch (error) {
      console.log(error);
    }
  };

  const deleteWorkspace = async Id => {
    try {
      await axios.delete(`https://api.swaglack.site/api/workspace/${Id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("Authorization"),
        },
      });
      fetchWorkspace(); //삭제된 후에 남은 workspace 화면에 표시
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async event => {
    event.preventDefault();
    setIsSubmitting(true);

    axios
      .post(
        "https://api.swaglack.site/api/workspace",
        {
          workspaceName,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("Authorization"),
          },
        }
      )
      .then(function (response) {
        console.log(response);
        setModalValue(response.data);
        setIsSubmitting(false);
        setModalIsOpen(false);
        fetchWorkspace();
      })
      .catch(function (error) {
        setIsSubmitting(false);
        console.log(error);
      });
  };

  const handleWorkspaceChange = event => {
    setWorkspaceName(event.target.value);
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div>
      <WorkspaceButton onClick={openModal}> {"Create Workspace"}</WorkspaceButton>

      {workspace.map(workspace => (
        <div key={workspace.workspaceId} onClick={() => dispatch(setWorkspaceId(workspace.workspaceId))}>
          <span>{workspaceName}</span>
          <DeleteButton
            onClick={e => {
              e.stopPropagation();
              deleteWorkspace(workspace.workspaceId); // Pass workspace.workspaceId instead of item.workspaceId
            }}
          >
            Delete
          </DeleteButton>
        </div>
      ))}

      <StyledModal isOpen={modalIsOpen} onRequestClose={closeModal}>
        <Header>Modal</Header>
        <form onSubmit={handleSubmit}>
          <input type="text" value={workspaceName} onChange={handleWorkspaceChange} placeholder="Enter workspace" />
          <SubmitButton type="submit" disabled={isSubmitting}>
            Add Workspace
          </SubmitButton>
        </form>
        <p>{modalValue}</p>
        <CloseButton onClick={closeModal}>Close</CloseButton>
      </StyledModal>
    </div>
  );
};

export default workSpace;

const StyledModal = styled(Modal)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  background: #fff;
  outline: none;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 2px 50px rgba(0, 0, 0, 0.1);
`;

const DeleteButton = styled.button`
  background-color: #f44336;
  color: #fff;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 5px;
  border-color: white;
`;

const WorkspaceButton = styled.button`
  background-color: #4a154b;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 20px;
  border-color: white;
`;

const Header = styled.h2`
  color: #4a154b;
`;

const SubmitButton = styled.button`
  background: #4a154b;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const CloseButton = styled.button`
  background: #fff;
  color: #4a154b;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
`;
