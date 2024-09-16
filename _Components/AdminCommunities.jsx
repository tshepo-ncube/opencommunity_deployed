import React, { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import CommunityDB from "../database/community/community";
import { useRouter } from "next/navigation";

const AdminCommunity = () => {
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [submittedData, setSubmittedData] = useState([]);
  const [editID, setEditID] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("All");

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        await CommunityDB.getAllCommunities(setSubmittedData, setLoading);
      } catch (error) {
        console.error("Error fetching communities:", error);
      }
    };

    fetchCommunities();
  }, []);

  const handleOpenPopup = () => {
    setPopupOpen(true);
  };

  const handleClosePopup = () => {
    setPopupOpen(false);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    console.log("About to run CommunityDB.editCommunity()");
    try {
      await CommunityDB.editCommunity(editID, {
        id: editID,
        name,
        description,
        category,
        status,
      });
    } catch (error) {
      console.error("Error editing community:", error);
    }

    setName("");
    setDescription("");
    setPopupOpen(false);
  };

  const handleOpenDeleteDialog = (id) => {
    setDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setDeleteId(null);
  };

  const handleDelete = async () => {
    if (deleteId) {
      try {
        await CommunityDB.deleteCommunity(deleteId);
        setSubmittedData(submittedData.filter((item) => item.id !== deleteId));
        handleCloseDeleteDialog();
      } catch (error) {
        console.error("Error deleting community:", error);
      }
    }
  };

  const handleArchive = async (id) => {
    try {
      await CommunityDB.updateCommunityStatus(id, "archived");
      setSubmittedData(
        submittedData.map((item) =>
          item.id === id ? { ...item, status: "archived" } : item
        )
      );
    } catch (error) {
      console.error("Error archiving community:", error);
    }
  };

  const handleUnarchive = async (id) => {
    try {
      await CommunityDB.updateCommunityStatus(id, "active");
      setSubmittedData(
        submittedData.map((item) =>
          item.id === id ? { ...item, status: "active" } : item
        )
      );
    } catch (error) {
      console.error("Error unarchiving community:", error);
    }
  };

  useEffect(() => {
    console.log("EditID : ", editID);
  }, [editID]);

  const handleEdit = (index) => {
    console.log("About to make an edit");
    //console.log(index);
    console.log(submittedData[index]);

    console.log(submittedData.find((item) => item.id === index));
    setName(submittedData.find((item) => item.id === index).name);
    setDescription(submittedData.find((item) => item.id === index).description);
    setStatus(submittedData.find((item) => item.id === index).status);
    setCategory(submittedData.find((item) => item.id === index).category);

    console.log(name, description, status, category);
    console.log(editIndex);
    setEditID(submittedData.find((item) => item.id === index).id);
    console.log(editID);
    setEditIndex(index);
    setPopupOpen(true);
  };

  const handlePost = async (id) => {
    try {
      await CommunityDB.updateCommunityStatus(id, "active");
      setSubmittedData(
        submittedData.map((item) =>
          item.id === id ? { ...item, status: "active" } : item
        )
      );
    } catch (error) {
      console.error("Error posting community:", error);
    }
  };

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
  };

  const getUniqueStatuses = (data) => {
    const statuses = data.map((item) => item.status);
    return Array.from(new Set(statuses));
  };

  const filterDataByStatus = (data) => {
    if (selectedStatus === "All") return data;
    return data.filter((item) => item.status === selectedStatus);
  };

  const filteredData = filterDataByStatus(submittedData);
  const uniqueStatuses = getUniqueStatuses(submittedData);

  const renderEventsByStatus = (status) => {
    const eventsByStatus = filteredData.filter(
      (event) => event.status === status
    );

    if (status === "All") {
      return uniqueStatuses.map((status) => {
        const events = filteredData.filter((event) => event.status === status);

        return (
          <div key={status} className="mb-4">
            <h2 className="text-xl font-bold mb-4">
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </h2>
            {events.length === 0 ? (
              <p>No communities currently exist with the status: {status}</p>
            ) : (
              <Grid container spacing={2} className="p-4">
                {events.map((data, index) => (
                  <Grid item xs={6} md={4} lg={4} key={index}>
                    {/* <Grid item xs={6} md={3} key={index}> */}
                    {/* <Card className="relative">
                      {data.status === "archived" && (
                        <div className="absolute top-2 left-2 bg-orange-500 text-white px-2 py-1 rounded-md text-xs font-bold z-10">
                          Archived
                        </div>
                      )}
                      {data.status === "active" && (
                        <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-md text-xs font-bold z-10">
                          Active
                        </div>
                      )}
                      {data.status === "draft" && (
                        <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded-md text-xs font-bold z-10">
                          Draft
                        </div>
                      )}
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                          {data.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Category: {data.category}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {data.description}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        {data.status === "archived" ? (
                          <>
                            <Button
                              size="small"
                              onClick={() => handleEdit(index)}
                            >
                              Edit
                            </Button>
                            <Button
                              size="small"
                              color="error"
                              onClick={() => handleOpenDeleteDialog(data.id)}
                            >
                              Delete
                            </Button>
                            <Button
                              size="small"
                              onClick={() => handleUnarchive(data.id)}
                            >
                              Unarchive
                            </Button>
                          </>
                        ) : data.status === "active" ? (
                          <>
                            <Button
                              size="small"
                              onClick={() => handleEdit(index)}
                            >
                              Edit
                            </Button>
                            <Button
                              size="small"
                              onClick={() => {
                                localStorage.setItem(
                                  "CurrentCommunity",
                                  data.id
                                );
                                router.push("/adminDash");
                              }}
                            >
                              View
                            </Button>
                            <Button
                              size="small"
                              color="error"
                              onClick={() => handleArchive(data.id)}
                            >
                              Archive
                            </Button>
                            <Button
                              size="small"
                              color="error"
                              onClick={() => handleOpenDeleteDialog(data.id)}
                            >
                              Delete
                            </Button>
                          </>
                        ) : (
                          // Draft status actions
                          <>
                            <Button
                              size="small"
                              onClick={() => handleEdit(index)}
                            >
                              Edit
                            </Button>
                            <Button
                              size="small"
                              onClick={() => handlePost(data.id)}
                            >
                              Post
                            </Button>
                            <Button
                              size="small"
                              color="error"
                              onClick={() => handleOpenDeleteDialog(data.id)}
                            >
                              Delete
                            </Button>
                          </>
                        )}
                      </CardActions>
                    </Card> */}

                    <div className="w-full max-w-sm bg-white border border-gray_og rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 relative">
                      <a href="#">
                        <img
                          className="h-40 w-full rounded-t-lg object-cover"
                          src="https://images.unsplash.com/photo-1607656311408-1e4cfe2bd9fc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGRyaW5rc3xlbnwwfHwwfHx8MA%3D%3D"
                          alt="product image"
                        />
                      </a>

                      {data.status === "archived" && (
                        <div
                          style={{ position: "absolute", top: 12, left: 10 }}
                          className="absolute bg-orange-500 text-white px-2 py-1 rounded-md text-xs font-bold z-10"
                        >
                          Archived
                        </div>
                      )}
                      {data.status === "active" && (
                        <div
                          style={{ position: "absolute", top: 12, left: 10 }}
                          className="absolute bg-green-500 text-white px-2 py-1 rounded-md text-xs font-bold z-10"
                        >
                          Active
                        </div>
                      )}
                      {data.status === "draft" && (
                        <div
                          style={{ position: "absolute", top: 12, left: 10 }}
                          className="absolute bg-blue-500 text-white px-2 py-1 rounded-md text-xs font-bold z-10"
                        >
                          Draft
                        </div>
                      )}

                      <div className="mt-4 px-5 pb-5">
                        <a href="#">
                          <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
                            {data.name}
                          </h5>
                        </a>
                        <div className="flex items-center mt-2.5 mb-5">
                          <div className="flex items-center space-x-1 rtl:space-x-reverse"></div>
                          <div className="text-sm text-black py-1  font-semibold">
                            {data.description}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          {/* <>
              <Button size="small" onClick={() => {}}>
                Edit
              </Button>
              <Button
                size="small"
                onClick={() => {
                  // localStorage.setItem(
                  //   "CurrentCommunity",
                  //   data.id
                  // );
                }}
              >
                View
              </Button>
              <Button size="small" color="error" onClick={() => {}}>
                Archive
              </Button>
              <Button size="small" color="error" onClick={() => {}}>
                Delete
              </Button>
            </> */}

                          <CardActions>
                            {data.status === "archived" ? (
                              <>
                                <Button
                                  size="small"
                                  onClick={() => handleEdit(data.id)}
                                >
                                  Edit
                                </Button>
                                <Button
                                  size="small"
                                  color="error"
                                  onClick={() =>
                                    handleOpenDeleteDialog(data.id)
                                  }
                                >
                                  Delete
                                </Button>
                                <Button
                                  size="small"
                                  onClick={() => handleUnarchive(data.id)}
                                >
                                  Unarchive
                                </Button>
                              </>
                            ) : data.status === "active" ? (
                              <>
                                <Button
                                  size="small"
                                  onClick={() => handleEdit(data.id)}
                                >
                                  Edit
                                </Button>
                                <Button
                                  size="small"
                                  onClick={() => {
                                    // localStorage.setItem(
                                    //   "CurrentCommunity",
                                    //   data.id
                                    // );
                                    console.log("The view");
                                    console.log(data.id);
                                    router.push(`/admin/Dashboard/${data.id}`);
                                  }}
                                >
                                  View
                                </Button>
                                <Button
                                  size="small"
                                  color="error"
                                  onClick={() => handleArchive(data.id)}
                                >
                                  Archive
                                </Button>
                                <Button
                                  size="small"
                                  color="error"
                                  onClick={() =>
                                    handleOpenDeleteDialog(data.id)
                                  }
                                >
                                  Delete
                                </Button>
                              </>
                            ) : (
                              // Draft status actions
                              <>
                                <Button
                                  size="small"
                                  onClick={() => handleEdit(data.id)}
                                >
                                  Edit
                                </Button>
                                <Button
                                  size="small"
                                  onClick={() => handlePost(data.id)}
                                >
                                  Post
                                </Button>
                                <Button
                                  size="small"
                                  color="error"
                                  onClick={() =>
                                    handleOpenDeleteDialog(data.id)
                                  }
                                >
                                  Delete
                                </Button>
                              </>
                            )}
                          </CardActions>
                        </div>
                      </div>
                    </div>
                  </Grid>
                ))}
              </Grid>
            )}
          </div>
        );
      });
    } else {
      if (eventsByStatus.length === 0) {
        return <p>No communities currently exist with the status: {status}</p>;
      }
      return (
        <Grid container spacing={2} className="p-4">
          {eventsByStatus.map((data, index) => (
            <Grid item xs={6} md={4} lg={4} key={index}>
              <div className="w-full max-w-sm bg-white border border-gray_og rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 relative">
                <a href="#">
                  <img
                    className="h-40 w-full rounded-t-lg object-cover"
                    src="https://images.unsplash.com/photo-1607656311408-1e4cfe2bd9fc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGRyaW5rc3xlbnwwfHwwfHx8MA%3D%3D"
                    alt="product image"
                  />
                </a>

                {data.status === "archived" && (
                  <div
                    style={{ position: "absolute", top: 12, left: 10 }}
                    className="absolute bg-orange-500 text-white px-2 py-1 rounded-md text-xs font-bold z-10"
                  >
                    Archived
                  </div>
                )}
                {data.status === "active" && (
                  <div
                    style={{ position: "absolute", top: 12, left: 10 }}
                    className="absolute bg-green-500 text-white px-2 py-1 rounded-md text-xs font-bold z-10"
                  >
                    Active
                  </div>
                )}
                {data.status === "draft" && (
                  <div
                    style={{ position: "absolute", top: 12, left: 10 }}
                    className="absolute bg-blue-500 text-white px-2 py-1 rounded-md text-xs font-bold z-10"
                  >
                    Draft
                  </div>
                )}

                <div className="mt-4 px-5 pb-5">
                  <a href="#">
                    <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
                      {data.name}
                    </h5>
                  </a>
                  <div className="flex items-center mt-2.5 mb-5">
                    <div className="flex items-center space-x-1 rtl:space-x-reverse"></div>
                    <div className="text-sm text-black py-1  font-semibold">
                      {data.description}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    {/* <>
              <Button size="small" onClick={() => {}}>
                Edit
              </Button>
              <Button
                size="small"
                onClick={() => {
                  // localStorage.setItem(
                  //   "CurrentCommunity",
                  //   data.id
                  // );
                }}
              >
                View
              </Button>
              <Button size="small" color="error" onClick={() => {}}>
                Archive
              </Button>
              <Button size="small" color="error" onClick={() => {}}>
                Delete
              </Button>
            </> */}

                    <CardActions>
                      {data.status === "archived" ? (
                        <>
                          <Button
                            size="small"
                            onClick={() => handleEdit(data.id)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="small"
                            color="error"
                            onClick={() => handleOpenDeleteDialog(data.id)}
                          >
                            Delete
                          </Button>
                          <Button
                            size="small"
                            onClick={() => handleUnarchive(data.id)}
                          >
                            Unarchive
                          </Button>
                        </>
                      ) : data.status === "active" ? (
                        <>
                          <Button
                            size="small"
                            onClick={() => handleEdit(data.id)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="small"
                            onClick={() => {
                              // localStorage.setItem("CurrentCommunity", data.id);

                              router.push(`/admin/Dashboard/${data.id}`);
                            }}
                          >
                            View
                          </Button>
                          <Button
                            size="small"
                            color="error"
                            onClick={() => handleArchive(data.id)}
                          >
                            Archive.
                          </Button>
                          <Button
                            size="small"
                            color="error"
                            onClick={() => handleOpenDeleteDialog(data.id)}
                          >
                            Delete
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            size="small"
                            onClick={() => handleEdit(data.id)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="small"
                            onClick={() => handlePost(data.id)}
                          >
                            Post
                          </Button>
                          <Button
                            size="small"
                            color="error"
                            onClick={() => handleOpenDeleteDialog(data.id)}
                          >
                            Delete
                          </Button>
                        </>
                      )}
                    </CardActions>
                  </div>
                </div>
              </div>
              {/* <Card className="relative">
                {data.status === "archived" && (
                  <div className="absolute top-2 left-2 bg-orange-500 text-white px-2 py-1 rounded-md text-xs font-bold z-10">
                    Archived
                  </div>
                )}
                {data.status === "active" && (
                  <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-md text-xs font-bold z-10">
                    Active
                  </div>
                )}
                {data.status === "draft" && (
                  <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded-md text-xs font-bold z-10">
                    Draft
                  </div>
                )}
                <CardContent>
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="div"
                    align="left"
                  >
                    {data.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Category: {data.category}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {data.description}
                  </Typography>
                </CardContent>
                <CardActions>
                  {data.status === "archived" ? (
                    <>
                      <Button size="small" onClick={() => handleEdit(index)}>
                        Edit
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        onClick={() => handleOpenDeleteDialog(data.id)}
                      >
                        Delete
                      </Button>
                      <Button
                        size="small"
                        onClick={() => handleUnarchive(data.id)}
                      >
                        Unarchive
                      </Button>
                    </>
                  ) : data.status === "active" ? (
                    <>
                      <Button size="small" onClick={() => handleEdit(index)}>
                        Edit
                      </Button>
                      <Button
                        size="small"
                        onClick={() => {
                          localStorage.setItem("CurrentCommunity", data.id);
                          router.push("/adminDash");
                        }}
                      >
                        View
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        onClick={() => handleArchive(data.id)}
                      >
                        Archive.
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        onClick={() => handleOpenDeleteDialog(data.id)}
                      >
                        Delete
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button size="small" onClick={() => handleEdit(index)}>
                        Edit
                      </Button>
                      <Button size="small" onClick={() => handlePost(data.id)}>
                        Post
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        onClick={() => handleOpenDeleteDialog(data.id)}
                      >
                        Delete
                      </Button>
                    </>
                  )}
                </CardActions>
              </Card> */}
            </Grid>
          ))}
        </Grid>
      );
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-100">
      {isPopupOpen && (
        <div className="fixed inset-0 left-0 w-full h-full flex justify-center items-center z-20">
          <div className="relative w-full max-w-lg p-6 bg-white rounded-lg shadow">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-black"
              onClick={handleClosePopup}
            >
              <CloseIcon />
            </button>
            <form onSubmit={handleFormSubmit}>
              <h2 className="text-2xl font-bold mb-4">
                {editIndex !== null ? "Edit Event" : "Create Event"}
              </h2>
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                {editIndex !== null ? "Save Changes" : "Submit"}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="w-full px-6 py-4">
        <FormControl variant="outlined" className="mb-4 w-full md:w-1/4">
          <InputLabel>Status</InputLabel>
          <Select
            value={selectedStatus}
            onChange={handleStatusChange}
            label="Status"
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="draft">Draft</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="archived">Archived</MenuItem>
          </Select>
        </FormControl>
        {loading ? (
          <div className="flex justify-center">
            <CircularProgress />
          </div>
        ) : (
          <div>{renderEventsByStatus(selectedStatus)}</div>
        )}
      </div>

      <Dialog
        open={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Delete Community"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this community? This action cannot
            be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="primary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AdminCommunity;
