var vid = document.getElementById('vid');
var can = document.getElementById('can');
function canvas() {
    can = document.getElementById("can"), vid = document.getElementById("vid");
    cdimcal = vid.videoWidth / vid.videoHeight;
    cwid = window.innerHeight * cdimcal;
    chei = window.innerHeight;
    can.width = cwid, can.style.width = cwid + "px";
    can.height = chei, can.style.height = chei + "px";
}
function draw(fx, fy, fw, fh) {
    var image = new Image();
    image.src = 'seened/1.png';
    x = fx + (fw / 2) - image.width / 2;
    y = fy - image.width - 20;
    ctx = document.getElementById("can").getContext('2d');
    ctx.drawImage(image, x, y);
}

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('/models')
]).then(startVideo);

function startVideo() {
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
        console.log(detections);
        if (detections.length > 0) {
            draw(detections.o.box.x, detections.o.box.y, detections.o.box.width, detections.o.box.height);
        }
    }, 500)
});
canvas();