import { useState } from "react";
import { useHistory } from "react-router-dom";
import { MoreVert, SearchOutlined } from "@material-ui/icons";
import Avatar from "@material-ui/core/Avatar";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";
import PropTypes from "prop-types";

function RoomHeader({ db, user, messages, roomName, roomId, seed, showDate }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const history = useHistory();
  const getLastSeenMessage = messages[messages.length - 1];

  const toggleOption = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const deleteRoom = (id) => {
    const deleteConfirmation = window.confirm("Are you Sure ?");
    if (deleteConfirmation) {
      db.collection("rooms")
        .doc(id)
        .delete()
        .then(() => history.push("/"))
        .catch((e) => console.error("Error removing document: ", e));
    }
  };

  return (
    <div className="room__header">
      <Avatar
        src={`https://avatars.dicebear.com/api/human/${seed}.svg`}
        alt="Group Avatar"
      />
      <div className="room__headerInfo">
        <h3>{roomName}</h3>
        {messages.length > 0 && (
          <p>Last update {showDate(getLastSeenMessage)}</p>
        )}
      </div>
      <div className="room__headerMenu">
        <IconButton aria-label="search message">
          <SearchOutlined />
        </IconButton>
        {user.uid === process.env.REACT_APP_ADMIN && (
          <IconButton
            aria-label="option menu"
            aria-controls="room-option-menu"
            aria-haspopup="true"
            className="sidebar__option"
            onClick={toggleOption}
          >
            <MoreVert />
          </IconButton>
        )}
        <Menu
          id="room-option-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={() => deleteRoom(roomId)}>Delete Room</MenuItem>
        </Menu>
      </div>
    </div>
  );
}

RoomHeader.propTypes = {
  db: PropTypes.objectOf(PropTypes.any),
  user: PropTypes.objectOf(PropTypes.any),
  messages: PropTypes.instanceOf(Array),
  roomName: PropTypes.string,
  roomId: PropTypes.string,
  seed: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  showDate: PropTypes.func,
};

export default RoomHeader;
