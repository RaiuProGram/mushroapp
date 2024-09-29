var vid = document.getElementById('vid');
var can = document.getElementById('can');
var m1 = false;

function load() {
    document.getElementById("can").style.width = vid.offsetWidth + "px";
    document.getElementById("can").style.height = vid.offsetHeight + "px";
    document.getElementById("can").width = vid.videoWidth;
    document.getElementById("can").height = vid.videoHeight;
    document.getElementById("vid").style.left = (window.innerWidth - vid.videoWidth) / 4 + "px";
    document.getElementById("can").style.left = (window.innerWidth - vid.videoWidth) / 4 + "px";
}
// dx = draw x, fx = face x
function calc(fx, fy, fw, fh, imgId) {
    const img = document.getElementById("mus" + imgId);
    dw = fw * 2;
    dh = dw * (img.height / img.width);
    // center fx = (fx + fw / 2)
    dx = (fx + fw / 2) - dw / 2;
    dy = fy - (fh * 0.8);
    draw(dx, dy, dw, dh, imgId);
}
function draw(x, y, w, h, imgId) {
    const ctx = document.getElementById('can').getContext("2d");
    const img = document.getElementById("mus" + imgId);
    ctx.drawImage(img, x, y, w, h);
}
function drawBox(x, y, w, h) {
    const ctx = document.getElementById('can').getContext("2d");
    ctx.fillStyle = "#000a";
    ctx.fillRect(x, y, w, h);
}

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
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
    const ctx = document.getElementById('can').getContext("2d");
    load();
    setInterval(async () => {
        const detections = await faceapi.detectAllFaces(vid, new faceapi.TinyFaceDetectorOptions());
        ctx.clearRect(0, 0, document.getElementById('can').width, document.getElementById('can').height);
        for (dect in detections) {
            console.log(dect % 2);
            //drawBox(detections[dect].box.x, detections[dect].box.y, detections[dect].box.width, detections[dect].box.height);
            calc(detections[dect].box.x, detections[dect].box.y, detections[dect].box.width, detections[dect].box.height, dect % 2);
        }
    }, 50)
});