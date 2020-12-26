// author: max wiesner
// personal website portfolio

var courseObjects = [];
var workObjects = [];
var allObjects = [];

var alignState = {
    courseDisplayView: [], // course display + work twirling
    courseTwirlingView: [], // course twirling
    mainTwirlingView: [], // course twirling + work twirling 
    workDisplayView: [], // course twirling + work display
    workTwirlingView: [] // work twirling 
};

var controls, camera, scene, cssRenderer, educationRoot, workRoot, staleRoot;
var welcomeRoot, welcomeObject, menu;
var educationToggle = false;
var workToggle = false;

init();

function init() {

    cssRenderer = createCssRenderer();
    document.getElementById('container').appendChild(cssRenderer.domElement);
    educationRoot = new THREE.Object3D();
    workRoot = new THREE.Object3D();
    staleRoot = new THREE.Object3D();
    welcomeRoot = new THREE.Object3D();

    mouse = new THREE.Vector2();
    scene = new THREE.Scene();
    menu = document.getElementById('menu');

    scene.add(educationRoot);
    scene.add(workRoot);
    scene.add(staleRoot);
    scene.add(welcomeRoot);

    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        1,
        10000);
    camera.position.set(0, 100, 4000);

    controls = new THREE.TrackballControls(camera, cssRenderer.domElement);
    controls.rotateSpeed = 0.5;
    controls.minDistance = 1;
    controls.maxDistance = 4500;
    controls.addEventListener('change', render);

    populateCourseObjectArray();
    populateWorkObjectArray();

    initTwirlingCourseCoordinates();
    initTwirlingWorkCoordinates();

    initCourseViewCoordinates();
    initWorkDisplayViewCoordinates();

    transform(allObjects, alignState.mainTwirlingView, 500);

    createMenu();

    window.addEventListener('resize', onWindowResize, false);
    document.addEventListener('mousemove', onDocumentMouseMove, false);

    welcomeIntro();

    animate();
}

function welcomeIntro() {

    var welcomeDiv = document.createElement('div');
    welcomeDiv.className = 'welcomeDiv';

    welcomeDiv.innerHTML = 
        '<div class="welcome">' + 
            '<p class="pintro">Welcome to my website.</p>' +
        '</div>' + 
        '<div class="name">' +
            '<p class="pintro">Maximillian Wiesner</p>' +
        '</div>' + 
        '<div class="controls">' +
            '<p class="pintro">Use this to help you navigate. </p>' +
        '</div>';

    welcomeObject = new THREE.CSS3DObject(welcomeDiv);
    welcomeRoot.add(welcomeObject);
}

function createMenu() {

    for ( var i = 0; i < buttonArray.length; i += 1 ) {

        var buttonElement = document.createElement('button');
        buttonElement.id = buttonArray[i].id;
        buttonElement.innerHTML = buttonArray[i].label;

        if ( buttonElement.id == 'work_button') {

            buttonElement.addEventListener('click', function (x) {
                if (workToggle) {
                    eliminateCourseFlipClass();
                    transform(allObjects, alignState.mainTwirlingView, 1000);
                    workToggle = false;
                } else {
                    eliminateCourseFlipClass();
                    transform(allObjects, alignState.workDisplayView, 1000);
                    workToggle = true;
                }
                educationToggle = false;
            }, false);

        } else if ( buttonElement.id == 'education_button') {

            buttonElement.addEventListener('click', function (x) {
                if (educationToggle) {
                    eliminateCourseFlipClass();
                    transform(allObjects, alignState.mainTwirlingView, 1000);
                    educationToggle = false;
                } else {
                    eliminateCourseFlipClass();
                    transform(allObjects, alignState.courseDisplayView, 1000);
                    educationToggle = true;
                }
                workToggle = false;
            }, false);
        }

        menu.appendChild(buttonElement);
    }   

}

function toScreenXY(pos3D) {

    var vector = obj.clone();
    var windowWidth = window.innerWidth;
    var minWidth = 1280;

  if(windowWidth < minWidth) {
    windowWidth = minWidth;
  }

  var widthHalf = (windowWidth/2);
  var heightHalf = (window.innerHeight/2);

  vector.project(camera);

  vector.x = ( vector.x * widthHalf ) + widthHalf;
  vector.y = - ( vector.y * heightHalf ) + heightHalf;
  vector.z = 0;

  return vector;
}

function initTwirlingCourseCoordinates() {

    var vector = new THREE.Vector3();
    var courseLength = courseArray.length;

    for (var i = 0; i < courseLength; i += 1) {

        var obj = new THREE.Object3D();
        var courseFormula = 2 * Math.PI * i / courseLength;

        obj.position.x = (900 * Math.cos(courseFormula));
        obj.position.y = (900 * Math.sin(courseFormula));
        obj.position.z = 0;

        vector.copy(obj.position).multiplyScalar(2);
        obj.lookAt(vector);
        // course twirling 
        alignState.courseTwirlingView[i] = obj;

        // main twirling = course twirling 
        alignState.mainTwirlingView[i] = obj;
    }
}

function initTwirlingWorkCoordinates() {

    var vector = new THREE.Vector3();
    var workLength = workObjects.length;

    for (var i = 0; i < workLength; i += 1) {

        var obj = new THREE.Object3D();
        var workFormula = 2 * Math.PI * i / workLength;

        obj.position.x = (700 * Math.cos(workFormula));
        obj.position.y = 0;
        obj.position.z = (700 * Math.sin(workFormula));

        vector.copy(obj.position).multiplyScalar(2);
        obj.lookAt(vector);

        // work twirling 
        alignState.workTwirlingView[i] = obj;
    }
    // main twirling = course twirling + work twirling 
    alignState.mainTwirlingView = alignState.mainTwirlingView.concat(alignState.workTwirlingView);
}

function initCourseViewCoordinates() {

    for (var i = 0; i < courseArray.length; i += 1) {

        var educCoord = new THREE.Object3D();
        educCoord.position.x = courseArray[i].position[0] * 420;
        educCoord.position.y = (courseArray[i].position[1]) * 200;
        educCoord.position.z = 3000;

        alignState.courseDisplayView[i] = educCoord;
    }
}


function initWorkDisplayViewCoordinates() {

    for (var i = 0; i < workArray.length; i += 1) {

        var workContentCoord = new THREE.Object3D();
        var workHeaderCoord = new THREE.Object3D();

        workContentCoord.position.x = workArray[i].contentPos[0] * 700;
        workContentCoord.position.y = workArray[i].contentPos[1] * 155;
        workContentCoord.position.z = 3000;

        workHeaderCoord.position.x = workArray[i].headerPos[0] * 700;
        workHeaderCoord.position.y = workArray[i].headerPos[1] * 155;
        workHeaderCoord.position.z = 3000;

        alignState.workDisplayView[i * 2] = workHeaderCoord;
        alignState.workDisplayView[i * 2 + 1] = workContentCoord;
    }
    // work display = course twirling + work display 
    alignState.workDisplayView = alignState.courseTwirlingView.concat(alignState.workDisplayView);
    // course display = course display + work twirling
    alignState.courseDisplayView = alignState.courseDisplayView.concat(alignState.workTwirlingView);
}

function populateCourseObjectArray() {

    for (var i = 0; i < courseArray.length; i += 1) {

        var courseDiv = document.createElement('div');
        courseDiv.className = 'course-element';

        courseDiv.innerHTML = 
            '<div class="course-card ' + courseArray[i].number + '" onclick="flip(' + courseArray[i].number + ')">' + 
                '<div class="front">' + 
                    '<h5 class="front-header">' + 
                        courseArray[i].name + 
                    '</h5>' + 
                '</div>' + 
                '<div class="back">' + 
                    '<div class="align-me">' +
                        '<p class="course-header">' + 
                            courseArray[i].type + courseArray[i].number + 
                        '</p>' + 
                        '<p class="languages">' +
                        courseArray[i].language + 
                        '</p>' +  
                    '</div>' +
                    '<p class="course-description">' + 
                        courseArray[i].description + 
                    '</p>' + 
                '</div>' + 
            '</div>';

        var courseObj = new THREE.CSS3DObject(courseDiv);
        educationRoot.add(courseObj);
        courseObjects[i] = courseObj;
    }
}

function populateEducationHeadersArray() {


}

function populateWorkObjectArray() {

    for (var i = 0; i < workArray.length; i += 1) {

        var workDiv = document.createElement('div');
        workDiv.className = 'work-element';

        var workHeaderDiv = document.createElement('div');
        workHeaderDiv.className = 'work-header-element';

        var tools = '';
        for (var j = 0; j < workArray[i].tools.length; j += 1) {
            tools += '<li>' + workArray[i].tools[j] + '</li>';
        }

        workHeaderDiv.innerHTML = '<div class="header">' +
            '<h5 class="name">' + workArray[i].title + '</h5>' +
            workArray[i].timeline + '<div>';

        workDiv.innerHTML = '<div class="header">' + '<h5 class="name">' +
            workArray[i].timeline + '</h5>' + '<p class="details">' +
            workArray[i].description + '</p>' + '<ol class="work-tools">' +
            tools + '</ol>' + '</div>';

        var workObj = new THREE.CSS3DObject(workDiv);
        var workObj2 = new THREE.CSS3DObject(workHeaderDiv);

        workRoot.add(workObj);
        workRoot.add(workObj2);

        workObjects[i * 2] = workObj;
        workObjects[i * 2 + 1] = workObj2;
    }
    // all objects = course objects + work objects 
    allObjects = courseObjects.concat(workObjects);
}

function transform(start, end, duration) {
    TWEEN.removeAll();
    for (var i = 0; i < start.length; i++) {

        var object = start[i];
        var target = end[i];

        new TWEEN.Tween(object.position)
            .to({
                    x: target.position.x,
                    y: target.position.y,
                    z: target.position.z
                },
                Math.random() * duration + duration)
            .easing(TWEEN.Easing.Exponential.InOut)
            .start();

        new TWEEN.Tween(object.rotation)
            .to({
                    x: target.rotation.x,
                    y: target.rotation.y,
                    z: target.rotation.z
                },
                Math.random() * duration + duration)
            .easing(TWEEN.Easing.Exponential.InOut)
            .start();
    }

    new TWEEN.Tween(this)
        .to({}, duration * 2)
        .onUpdate(render)
        .start();
}

function createCssRenderer() {

    var cssRenderer = new THREE.CSS3DRenderer();
    cssRenderer.setSize(window.innerWidth, window.innerHeight);
    cssRenderer.domElement.style.top = 0;

    return cssRenderer;
}


function render() {

    cssRenderer.render(scene, camera);
}


function animate() {

    const time = Date.now() * 0.0004;

    // if (!educationToggle) {

    //     educationRoot.rotation.x = time;
    //     educationRoot.rotation.y = time * 0.6;
    // }

    // if (!workToggle) {

    //     workRoot.rotation.x = time * 0.6;
    //     workRoot.rotation.y = time;
    // }

    scene.updateMatrixWorld();
    controls.update();
    TWEEN.update();
    render();
    requestAnimationFrame(animate);
}

function flip(element) {
    $('.' + element).toggleClass('flipped');
}

function eliminateCourseFlipClass() {
    $('.course-card').removeClass('flipped');
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    cssRenderer.setSize(window.innerWidth, window.innerHeight);
    render();
}

function onDocumentMouseMove(event) {

    event.preventDefault();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}