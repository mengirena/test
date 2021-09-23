let video;
let poseNet;
let pose;
let skeleton;
let eye,beard,hat;
let myCanvas; 

function centerCanvas()  {
  let x = windowWidth/2 - width/2; 
  let y = windowHeight/2 - height/2; 
  myCanvas.position(x,y); 
}

function preload(){
  eye = loadImage('eye.gif');
  beard = loadImage('beard.png');
  hat = loadImage('hat.png');
}

function setup() {
  
  myCanvas = createCanvas(640*1.5, 480*1.5);
  centerCanvas();
  
  video = createCapture(VIDEO);
  video.size(width,height);
  video.hide();
  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on('pose', gotPoses);
}

function gotPoses(poses) {
  //console.log(poses); 
  if (poses.length > 0) {
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
  }
}


function modelLoaded() {
  console.log('poseNet ready');
}

function draw() {
  imageMode(CORNER);
  push();
  scale(-1,1)
  image(video, -width, 0,width,height);
  pop();

  if (pose) {
    let eyeR = pose.rightEye;
    let eyeL = pose.leftEye;
    let nose = pose.nose;
    let d = dist(eyeR.x, eyeR.y, eyeL.x, eyeL.y);
    imageMode(CENTER);
    image(eye,width-eyeR.x,eyeR.y,eye.width/5,eye.height/5);
    image(eye,width-eyeL.x,eyeL.y,eye.width/5,eye.height/5);
    image(beard,width-nose.x,nose.y+40,beard.width/10,beard.height/10);
    //image(hat,width-nose.x,nose.y-200,hat.width/6,hat.height/6);
    // fill(255, 0, 0);
    // ellipse(pose.nose.x, pose.nose.y, d);
    // fill(0, 0, 255);
    // ellipse(pose.rightWrist.x, pose.rightWrist.y, 32);
    // ellipse(pose.leftWrist.x, pose.leftWrist.y, 32);
    
    for (let i = 0; i < pose.keypoints.length; i++) {
      let x = pose.keypoints[i].position.x;
      let y = pose.keypoints[i].position.y;
      // fill(0,255,0);
      // ellipse(x,y,16,16);
    }
    
    for (let i = 0; i < skeleton.length; i++) {
      let a = skeleton[i][0];
      let b = skeleton[i][1];
      // strokeWeight(2);
      // stroke(255);
      // line(a.position.x, a.position.y,b.position.x,b.position.y);      
    }
  }
}

function windowResized() {
  centerCanvas();//執行畫布置中function
}


// function recordCanvasStreamRecorder(){
//   console.log("media stream recorder")
//   let canvas = document.querySelector('canvas')
//   let stream = canvas.captureStream(15)
//   mediaRecorder = new MediaStreamRecorder(stream);
//   mediaRecorder.stream = stream;
//   mediaRecorder.mimeType = 'image/gif'; // this line is mandatory
//   mediaRecorder.videoWidth = 960;
//   mediaRecorder.videoHeight = 720;
//   // let saveBlob = (function () {
//   //   let a = document.createElement("a");
//   //   document.body.appendChild(a);
//   //   a.style = "display: none";
//   //   return function (blob, fileName) {
//   //       var url = window.URL.createObjectURL(blob);
//   //       a.href = url;
//   //       a.download = fileName;
//   //       a.click();
//   //       window.URL.revokeObjectURL(url);
//   //     }
//   //   }());

//   // saveBlob(blob, 'test.zip');
//   mediaRecorder.ondataavailable = function(blob) {
//     console.log('data available')
//     console.log(blob)
//     let a = document.createElement('a');
//     a.target = '_blank';
//     a.innerHTML = 'Open Recorded GIF No. ' + (index++) + ' (Size: ' + bytesToSize(blob.size) + ') Time Length: ' + getTimeLength(timeInterval);
//     a.href = URL.createObjectURL(blob);

//     document.appendChild(a);
//   }

//   mediaRecorder.start(100)
// }

let canvas
let button = document.querySelector('button')
let mediaRecorder;
let chunks = [];
let capturer
let videoEl
let url


button.addEventListener("click", recordCanvasCC)


function recordCanvasCC(){
  if (button.className === "off"){
    canvas = document.querySelector('#defaultCanvas0')
    console.log("start record")
    button.classList.toggle("off")
    button.innerHTML = "Stop"
    capturer = new CCapture( { format: 'gif', workersPath: './' } );
    capturer.start();
    function render(){
      requestAnimationFrame(render);
      // rendering stuff ...

      capturer.capture( document.querySelector('#defaultCanvas0') );
    }
    
    render()
  }else{
    
    capturer.stop();
    videoEl = document.querySelector('video')
    
    // default save, will download automatically a file called {name}.extension (webm/gif/tar)
    // capturer.save();
    capturer.save((blob) => {
      url = URL.createObjectURL(blob);
      const img = document.createElement('img')

      img.addEventListener("click", downloadFif)
    
      img.src = url
      img.style.width = "320px"
      img.style.height = "240px"
      img.style.position = "absolute"
      img.style.top = "37.5px"//"260px"
      img.style.left = "5px"
      canvas.style.left = "5px"
      canvas.style.width = "320px"
      canvas.style.height = "240px"
      canvas.style.display = "none"

      // canvas.style["aspect-ratio"] = 1.3
      // canvas.style.left = "0px"
      // canvas.style.width = "300px"
      // canvas.style["aspect-ratio"] = 1.3

      document.body.insertBefore(img,canvas.parentNode)
      // const a = document.createElement("a");
      // a.href = url;
      // a.download = "recording.gif";
      // a.click();
      // URL.revokeObjectURL(url);
    });
    console.log("stop")
    button.classList.toggle("off")
    button.innerHTML = "Record"

  }
}

function downloadFif(){
      const a = document.createElement("a");
      a.href = url;
      a.download = "recording.gif";
      a.click();
      URL.revokeObjectURL(url);
}

function recordCanvas(){
  if (button.className === "off"){
    canvas = document.querySelector('#defaultCanvas0')
    console.log("start record")
    button.classList.toggle("off")
    button.innerHTML = "Stop"
    console.log(canvas)
    let videoStream = canvas.captureStream(25)
    //Now recording is on
    mediaRecorder = new MediaRecorder(videoStream,{mimeType : 'video/webm;codecs=vp9',ignoreMutedMedia: true})
    mediaRecorder.ondataavailable = function(e) {
      if(e.data.size > 0){
        chunks.push(e.data)
      }
    }
    mediaRecorder.start()
    
    // mediaRecorder.onstop = function(e) {
    //   console.log("saving")
    //   let blob = new Blob(chunks, { 'type' : 'video/mp4' }) // other types are available such as 'video/webm' for instance, see the doc for more info
    //   chunks = []
    //   // let videoURL = URL.createObjectURL(blob)
    //   // // video.src = videoURL
    //   // let link = document.createElement("a"); // Or maybe get it from the current document
    //   // link.href = videoURL;
    //   // link.download = "aDefaultFileName.mp4";
    //   // link.innerHTML = "Click here to download the file";
    //   // document.body.appendChild(link); // Or append it whereever you want

    //   console.log(mediaRecorder.mimeType)

    //   let saveBlob = (function () {
    //     let a = document.createElement("a");
    //     document.body.appendChild(a);
    //     a.style = "display: none";
    //     return function (blob, fileName) {
    //         var url = window.URL.createObjectURL(blob);
    //         a.href = url;
    //         a.download = fileName;
    //         a.click();
    //         window.URL.revokeObjectURL(url);
    //       }
    //     }());
    
    //   saveBlob(blob, 'test.zip');
    // }

  } else {
    console.log("stop")
    button.classList.toggle("off")
    button.innerHTML = "Record"
    //Recording is done
    mediaRecorder.stop()
    setTimeout(() => {
      const blob = new Blob(chunks, {
        type: "video/webm"
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "recording.webm";
      a.click();
      URL.revokeObjectURL(url);
    },0);

  }
  
}