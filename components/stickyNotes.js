import React, { useState, useEffect } from "react";

export default function StickyNotes() {

  const [stickyNotes, setStickyNotes] = useState(true);

  const NewNote = () => {
    return(
      <>
      <h1> Write a new note</h1>
      {/* amount to donate */}
      <label> Amount to donate </label>
      <input type="number" />
      <br />
      {/* message of length 64 max */}
      <label>Message</label>
      <input
      style={{height:"100px", width:"300px"}}
      type="text" />
      <br/>
      <br/>
      <br/>
      </>
    )
  }

  const Notes = () => {
    return(

      <div className="note">
      0x..2FAB <br />
      $100
      <br />
      Have a good day!
    </div>
    )
  }


  return (<>
    {stickyNotes && <Notes/>}
    {!stickyNotes && <NewNote/>}
    <button onClick={() => setStickyNotes(!stickyNotes)}> {stickyNotes ? "New Note" : "Back"} </button>
    </>

  );

}
