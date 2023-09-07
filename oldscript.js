var cwid, chei, cdimcal;
var video = document.getElementById("vid");


function canvas() {
    cdimcal = video.videoWidth / video.videoHeight;
    cwid = window.innerHeight * cdimcal;
    chei = window.innerHeight;
    can.width = cwid, can.style.width = cwid + "px";
    can.height = chei, can.style.height = chei + "px";
    
}
function draw(x, y, width, height) {
    ctx = document.getElementById("can").getContext('2d');

    
}



Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models')
]).then(startVideo);
if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true })
    .then(function (stream) {
        video.srcObject = stream;
    })
    .catch(function (err0r) {
        console.log("Something went wrong!");
    });
}
function stop(e) {
    var stream = video.srcObject;
    var tracks = stream.getTracks();
    for (var i = 0; i < tracks.length; i++) {
        var track = tracks[i];
        track.stop();
    }
    video.srcObject = null;
}

video.addEventListener('play', () => {;
    const canvas = faceapi.createCanvasFromMedia(video);
    document.body.append(canvas);
    const displaySize = { width: video.width, height: video.height }
    faceapi.matchDimensions(canvas, displaySize)
    setInterval(async () => {
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
        faceapi.draw.drawDetections(canvas, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
    }, 100)
});
