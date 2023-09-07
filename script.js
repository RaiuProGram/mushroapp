var vid = document.getElementById('vid');
var can = document.getElementById('can');
var dx, dy;
function canvas() {
    can.width = window.innerWidth
    can.height = window.innerHeight;
    canwid = vid.videoHeight * (vid.videoWidth / vid.videoHeight);
    dx = vid.videoHeight * (vid.videoWidth / vid.videoHeight) / vid.videoWidth;
    dy = window.innerHeight / vid.videoHeight;
}
function draw(fx, fy, fw, fh) {
    var image = new Image();
    image.src = 'seened/1.png';
    x = fx + (fw / 2) - (image.width / 2);
    y = fy - 0;
    ctx = document.getElementById("can").getContext('2d');
    ctx.drawImage(image, fx, fy);

    console.log(image.height);
}

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('/models')
]).then(startVideo);

function startVideo() {
    canvas();
    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
        .then(function (stream) {
            vid.srcObject = stream;
        })
        .catch(function (err0r) {
            console.log("Something went wrong!");
        });
    }
}

vid.addEventListener('play', () => {
    setInterval(async () => {
        const detections = await faceapi.detectAllFaces(vid, new faceapi.TinyFaceDetectorOptions());
        //console.log(detections);
        if (detections.length > 0) {
            draw(detections[0].box.x, detections[0].box.y, detections[0].box.width, detections[0].box.height);
        }
    }, 500)
});
