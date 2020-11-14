import { useState } from "react";
import { useStateValue } from "../store/StateProvider";
import { Link } from "react-router-dom";
import db from "../firebase";
import { auth } from "../firebase";
import firebase from "firebase";
import { Chat as ChatIcon, MoreVert, SearchOutlined } from "@material-ui/icons";
import IconButton from "@material-ui/core/IconButton";
import Avatar from "@material-ui/core/Avatar";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

export default function SidebarHeader({}) {
  const [{ user }] = useStateValue();
  const [anchorEl, setAnchorEl] = useState(null);
  const createChat = () => {
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

  const clickLogout = () => {
    setAnchorEl(null);
    if (user) {
      auth.signOut().then(() => localStorage.removeItem("user"));
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
            <Avatar src={user?.photoURL} />
          </Link>
        </div>
        <div className="sidebar__headerRight">
          <IconButton onClick={createChat}>
            <ChatIcon />
          </IconButton>
          <IconButton
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
          <input placeholder="Search or start new chat" type="text" />
        </div>
      </div>
    </div>
  );
}
