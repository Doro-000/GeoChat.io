// external dependency imports
import date from 'date-and-time';
import { React, useRef, useState, useEffect } from "react";
import { Paper } from "@material-ui/core";

// File Imports
import { TextInput } from "./Input";
import { MessageLeft, MessageRight } from "./Message";
import useStyles from "./styles/dashboard_S"
import { getMessages } from '../../services/MessageService';

//socket imports
import socket from "../../services/socket";

export default function Dashboard(props) {
  const [input, setInput] = useState([]);
  const [output, setoutput] = useState([]);
  const messagesEndRef = useRef(null)
  const { to, currentUser } = props;

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
  }

  function handleSubmit(message) {
    const pattern = date.compile('MMM D YYYY h:m:s A');
    const compiledMsg = { message, timestamp: date.format(new Date(), pattern) }
    const new_input = input.concat([compiledMsg]);

    socket.emit("pubMsg", compiledMsg);
    // socket.emit("chat message", new_input[input.length - 1]);
    // console.log("sending", new_input[input.length - 1]);

    setInput(new_input);
  }

  useEffect(scrollToBottom, [input]);

  useEffect(() => {
    const fetchMessages = async() => {
      const res = await getMessages({
        to,
        currentUser
      });
      setoutput(res);
    }
    fetchMessages();
  }, [props.to]);

  const classes = useStyles();
  return (
    <div className={classes.container}>
      <Paper id="style-1" className={classes.messagesBody}>
        {/* <MessageLeft
            message=" const photoURL = props.photoURL ? props.photoURL : "
            timestamp= 'MM/DD 00:00'
            photoURL="https://lh3.googleusercontent.com/a-/AOh14Gi4vkKYlfrbJ0QLJTg_DLjcYyyK7fYoWRpz2r4s=s96-c"
            displayName=""
            avatarDisp={true}
          />
          <MessageLeft
            message="xxxxxhttps://yahoo.co.jp xxxxxxxxx"
            timestamp="MM/DD 00:00"
            photoURL=""
            displayName="https"
            avatarDisp={false}
          />
          <MessageLeft
            message="messageR"
            timestamp="MM/DD 00:00"
            photoURL="https://lh3.googleusercontent.com/a-/AOh14Gi4vkKYlfrbJ0QLJTg_DLjcYyyK7fYoWRpz2r4s=s96-c"
            displayName="まさりぶ"
            avatarDisp={true}
          />
          <MessageRight
            message="messageR"
            timestamp="MM/DD 00:00"
            photoURL="https://lh3.googleusercontent.com/a-/au=s96-c"
            displayName="message3"
            avatarDisp={false}
          /> */}
        {output && output.map(x => (
        (<MessageRight
          message={x.message}
          timestamp={x.timestamp}
          photoURL="https://lh3.googleusercontent.com/a-/au=s96-c"
          displayName={x.sender}
          avatarDisp={false}
        />) ? x.sender === currentUser: (<MessageLeft
          message={x.message}
          timestamp={x.timestamp}
          photoURL="https://lh3.googleusercontent.com/a-/au=s96-c"
          displayName={x.sender}
          avatarDisp={false}
        />)
        ))}
        <div ref={messagesEndRef} />
      </Paper>
      <Paper className={classes.paper}>
        <TextInput onClick={(i) => handleSubmit(i)} />
      </Paper>
    </div>
  );
}