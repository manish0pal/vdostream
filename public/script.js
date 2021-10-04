const socket = io('/')

const CandidateMainData = {
  userId:testinguserID,
  candidateId:testinguserID,
  candiName:"Manish",
  videoId:"vdo"+testinguserID,
  examStatus:"Active",
  ipAddress:"192.165.15.01",
  timeRemening:"30 min",
  faceStatus:"Single Face Dected",
  windowStatus:"Full Screen"
}


//let candidate_list_grid = document.getElementById("candidate_list");
const myPeer = new Peer(CandidateMainData.userId, {
  
  path: '/peerjs',
  host: '/',
  port: '443'
})

let usercheck = [];
let myVideoStream;
const myVideo = document.createElement('video')
myVideo.muted = true;
const peers = {}
navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  myVideoStream = stream;
  console.log("Stream My video");
  //to be comment it out
  addVideoStream( stream,CandidateMainData)
  myPeer.on('call', call => {
    //to be comment it out
    call.answer(stream)
    console.log("   call.answer(stream)");
    //const video = document.createElement('video')
    // call.on('stream', (userVideoStream) => {

    //   deltempdata =  call.metadata;
    //   deltempdata.userId=call.peer;
    //   deltempdata.candidateId=call.peer;
    //   deltempdata.videoId="vdo"+call.peer;
    //   if(usercheck.indexOf(deltempdata.userId) != -1){
    //     console.log("if  present in :",usercheck)
    //   } 
    //   else{
       
    //     console.log(" Stream Call from ",call.peer);
    //   addVideoStream( userVideoStream,call.metadata)
    //   usercheck.push(call.metadata.userId);
    //   }  
    // })
  })

  //mute by default
  myVideoStream.getAudioTracks()[0].enabled = false;
  

  socket.on('user-connected', user => {
    connectToNewUser(user, stream)
    console.log("user-connected",user);
  })
  // input value
  let text = $("input");
  // when press enter send message
  // $('html').keydown(function (e) {
  //   if (e.which == 13 && text.val().length !== 0) {
  //     socket.emit('message', text.val());
  //     console.log("message-sent");
  //     text.val('')
  //   }
  // });
 
  // socket.on("createMessage", message => {
  //   console.log("message-recived",message);
  //   $("ul").append(`<li class="message"><b>user</b><br/>${message}</li>`);
  //   scrollToBottom()
  // })
})


const msgbox = document.getElementById("setmsgbox");


socket.on("createMessage", msgdata => {
 addmsg(msgdata);
  
})
const addmsg = (msgdata)=>{
  let classname = "other";
  if(msgdata.userId  == CandidateMainData.userId){
    classname = "me"
  }
  let msgspan = document.createElement('span')
  msgspan.className = classname;
  msgspan.innerHTML = msgdata.msg
  msgbox.appendChild(msgspan)
}

const sendChatMsg = () => {
  let msgtobesend = document.getElementById("msgtobesend").value;
  document.getElementById("msgtobesend").value = "";
  socket.emit('candidate_message',{userId:CandidateMainData.userId,msg:msgtobesend} );
  addmsg({userId: "other",msg:msgtobesend})
}

//proctor
// socket.on('getUserEvent',userEvent=>{
//   console.log("getUserEvent:",userEvent);
// })

//candidate
socket.on("getControlEvent",params =>{
  console.log("getControlEvent:",params);
  alert(params);
})

// socket.on('user-disconnected', userId => {
//   if (peers[userId]) peers[userId].close()
//   console.log("u-disconnected :",userId);
// })






// 1 First join room 
myPeer.on('open', id => {
  
  socket.emit('join-room', ROOM_ID, CandidateMainData)
  console.log("peer open join-room :",id,"proctor",CandidateMainData);
})

function connectToNewUser(user, stream) {
  options = {metadata:user};
  console.log(options);
  
   
const call = myPeer.call(user.userId, stream,options)  
 
//  const video = document.createElement('video')
  // call.on('stream',( userVideoStream) => {
  //   console.log("call stream",user);
  //    if(usercheck.indexOf(user.userId) != -1){
  //      console.log("call stream if :",usercheck)
  //    }
  //    else{
  //     usercheck.push(user.userId);
  //   console.log("call stream checkUserList :",usercheck)
  //   addVideoStream(userVideoStream,options.metadata)
    
  //   }
  // })
  // call.on('close', () => {
  //   console.log("call close");
  //   try {

  //     const index = usercheck.indexOf(user.userId);
  //     if (index > -1) {
  //       usercheck.splice(index, 1);
  //     }
     
  //     let delcard = document.getElementById(user.userId);
  //     delcard.remove()
     
  //   } catch (error) {
  //     console.log("delete ",error);
  //   }
  // })

  peers[user.userId] = call
}

function addVideoStream(stream,candidateData) {
  console.log("addVideosStram",candidateData);

   /* let tempdiv = document.createElement('div');
    tempdiv.className = "col-12 col-sm-6 col-md-4 col-lg-4 col-xl-3 mb-3"
    tempdiv.id = "card"+candidateData.candidateId;
    tempdiv.innerHTML = ` <div class="card "> <video class="img-fluid m-2" id="${candidateData.videoId}" alt="Card image"></video> <div class="card-body candidate_card" id="candi_card_body_${candidateData.candidateId}"> </div> </div> `
    candidate_list_grid.appendChild(tempdiv);
    let candi_video = document.getElementById(candidateData.videoId);
    candi_video.srcObject = stream
    candi_video.addEventListener('loadedmetadata', () => {
      candi_video.play()
    })
    let candi_card_body = document.getElementById(`candi_card_body_${candidateData.candidateId}`);
    candi_card_body.innerHTML = `<div class="row"><div class="col-11 card mb-2 mt-2 p-2"> <table id="candidate_table" class="candidate_table"> 
<tr> <th>Enrollment No</th> <td>${candidateData.candidateId} </td> 
</tr> <tr> <th>Name</th> <td>${candidateData.candiName} </td>
</tr> <tr> <th>Exam Status</th> <td>${candidateData.examStatus}</td> </tr>
<tr> <th>Ip Address</th> <td>${candidateData.ipAddress}</td> </tr> 
<tr> <th>Time Remaining</th> <td>${candidateData.timeRemaning}</td> </tr> 
<tr> <th>Face Status</th> <td>${candidateData.faceStatus} <span class="blink_me"> <!-- <svg height="15" width="15"> <circle cx="5" cy="5" r="5" fill="#6495ED"/> </svg> --> </span></td> </tr> 
<tr> <th>Window Minimize</th> <td>${candidateData.windowStatus}</td> </tr> 
</table> <div class="pb-2 center"> 
<button type="button" class="btn btn-default c_tooltip" onclick="refresh">
<i class="fa fa-refresh" aria-hidden="true"></i> 
<span class="c_tooltiptext">Refresh Candidate Data</span>
 </button> <button  type="button" class="btn btn-default c_tooltip " onclick="controlEvents('${candidateData.candidateId}','screen-share')">
   <i class="fa fa-desktop" aria-hidden="true"></i> 
   <span class="c_tooltiptext">WebCam/Screen </span> </button>
    <button type="button" class="btn btn-default c_tooltip" onclick="chat"> <i class="fa fa-commenting-o" aria-hidden="true"></i> <span class="c_tooltiptext">Chat with Candidate</span> </button> <button type="button" class="btn btn-default c_tooltip " onclick="voice"> <i class="fa fa-microphone-slash" aria-hidden="true"></i> <span class="c_tooltiptext">Mute/Unmute Candidate</span> </button> <button type="button" class="btn btn-default c_tooltip" onclick="pause"> <i class="fa fa-pause" aria-hidden="true"></i> <span class="c_tooltiptext">Pause/Resume Candidate Exam</span> </button> <!-- <button type="button" class="btn btn-success"onclick="resume">Resume</button> --> <br /> 
    <br /> 
    <button type="button" class="btn btn-danger" onclick="terminate">Terminate</button>
     <button type="button" class="btn btn-success" onclick="relogin">Allow Re-Login</button>
      </div> </div> </div>`;
*/
}






// //proctor
// const controlEvents= (userID,todo)=>{
//   let controlData = { 'userId':userID,'event':todo }
//   console.log('controlEvents',controlData)
//   socket.emit('control-event',controlData);
// }

//candidate
const userEvent = () => {
 
  let controlData = { 'userId': CandidateMainData.userId,'event':"userEvent by "+CandidateMainData.userId }
  console.log('controlEvents',controlData)
  socket.emit('userEvent',controlData);
}

