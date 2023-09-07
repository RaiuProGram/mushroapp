var vid = document.getElementById('vid');

var dx, dy, imgw, imgh, imgd, img;
function load() {
    dx = window.innerHeight * (vid.videoWidth / vid.videoHeight) / vid.videoWidth;
    dy = window.innerHeight / vid.videoHeight;
    img = [document.getElementById("m0"), document.getElementById("m1"), document.getElementById("m2")];
    imgd = [img[0].width / img[0].height, img[1].width / img[1].height, img[2].width / img[2].height];
    imgfd = [3, 2, 3];
    imgfh = [0, 0, 0];
}
function draw(fx, fy, fw, fh, p) {
    fx *= dx, fy *= dy, fw *= dx, fh *= dy;
    imgw = fw * 3;
    imgh = imgw * imgd[p];
    x = fx + (fw / 2) - (imgw / 2);
    y = fy - imgh - imgfd[p];
    img[p].style.left = (x / dx) + "px";
    img[p].style.top = (y / dy) + "px";
    img[p].style.width = (imgw / dx) + "px";
    img[p].style.height = (imgh / dy) + "px";
    console.log(x + " ja " + y);
    
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
    load();
    setInterval(async () => {
        const detections = await faceapi.detectAllFaces(vid, new faceapi.TinyFaceDetectorOptions());
        //console.log(detections);
        if (detections.length > 0) {
            draw(detections[0].box.x, detections[0].box.y, detections[0].box.width, detections[0].box.height, 0);
        }
    }, 500)
});
