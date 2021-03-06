import { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { Chat as ChatIcon, MoreVert, SearchOutlined } from "@material-ui/icons";
import IconButton from "@material-ui/core/IconButton";
import Avatar from "@material-ui/core/Avatar";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import InputBase from "@material-ui/core/InputBase";
import firebase from "firebase/app";
import "firebase/firestore";
import db, { auth } from "../../firebase";
import { useStateValue } from "../../store/StateProvider";

export default function SidebarHeader() {
  const [{ user }] = useStateValue();
  const [anchorEl, setAnchorEl] = useState(null);
  const history = useHistory();

  const createRoom = () => {
    const roomName = prompt("Please enter name for chat room");
    if (roomName) {
      db.collection("rooms").add({
        name: roomName,
        datecreated: firebase.firestore.FieldValue.serverTimestamp(),
      });
    }
  };

  const toggleOption = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const clickLogout = (event) => {
    setAnchorEl(event.currentTarget);
    if (user) {
      auth
        .signOut()
        .then(() => history.push("/"))
        .then(() => localStorage.removeItem("user"));
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="sidebar__header">
      <div className="sidebar__headerMenu">
        <div className="sidebar__headerLeft">
          <Link to="/">
            <Avatar src={user?.photoURL} alt="Group Avatar" />
          </Link>
        </div>
        <div className="sidebar__headerRight">
          <IconButton aria-label="new-room" onClick={createRoom}>
            <ChatIcon />
          </IconButton>
          <IconButton
            aria-label="option menu"
            aria-controls="option-menu"
            aria-haspopup="true"
            className="sidebar__option"
            onClick={toggleOption}
          >
            <MoreVert />
          </IconButton>
          <Menu
            id="option-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={clickLogout}>Logout</MenuItem>
          </Menu>
        </div>
      </div>
      <div className="sidebar__search">
        <div className="sidebar__searchContainer">
          <SearchOutlined />
          <InputBase
            inputProps={{ "aria-label": "search bar" }}
            placeholder="Search or start new room"
            type="text"
          />
        </div>
      </div>
    </div>
  );
}
