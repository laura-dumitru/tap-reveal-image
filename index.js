let options = {
  stickyImage: true, // follows the user's finger
  staticImage: false, //stops on the screen when the user lets go, doesn't follow finger.
  hideImage: true, // shows the image after the finger leaves the hotspot. If sticky, this option should stay true.
  transition: "0.5s", //duration in seconds that it takes for the change from one image to another.
  offsetX: 0, // horizontal offset - value in pixels.It determines how far to the left or right of your thumb the image will appear.
  offsetY: -200, //vertical offset - value in pixels. It determines how far above or below your thumb the image will appear.
};

const regex = /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
const mobile = regex.test(navigator.userAgent);

let moving = false;
let x, y;
let image;
let lastTouchedCta;

const hotspots = Array.from(document.querySelectorAll(".grid .hotspot"));
const images = Array.from(document.querySelectorAll(".grid img"));
const ctaGroup = document.querySelector(".cta");

// Loop over images and hide each one with opacity 0
function hideImages() {
  images.forEach((image) => (image.style.opacity = 0));
}
hideImages();

function showImages() {
  images.forEach((image) => (image.style.opacity = 1));
}

function followFinger(event) {
  event.preventDefault();

  x = event.clientX;
  y = event.clientY;

  // Position the image to the centre
  function positionImage(image, x, y) {
    const xOffset = x - options.offsetX;
    const yOffset = y - options.offsetY;
    // Calculate the position relative to the container
    //image.style.position = "absolute"; translate x and y
    //image.style.top = `calc(${yOffset}px - ${image.style.height} / 2)`;
    //image.style.left = `calc(${xOffset}px - ${image.style.width}  / 2)`;
    image.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
  }

  if (moving) {
    // Iterate over each hotspot to check if the finger is inside
    hotspots.forEach(function (hotspot, index) {
      const rect = hotspot.getBoundingClientRect();
      const image = images[index];
      image.style.transition = `opacity ${options.transition}`;
      if (
        x >= rect.left &&
        x <= rect.right &&
        y >= rect.top &&
        y <= rect.bottom
      ) {
        //console.log(`Finger is inside hotspot ${index}`);
        image.style.opacity = 1;
      } else {
        // console.log(`Finger is outside hotspot${index}`);
        image.style.opacity = 0;
      }
      if (options.stickyImage) {
        positionImage(image, x, y); // options.transition
      }
    });
    //////////////// same as celtra up to here
  }
}

// add touchstart and touchend event listeners for mobile
if (mobile) {
  document.addEventListener("touchmove", followFinger);

  images.forEach((image) => {
    image.addEventListener("touchstart", (event) => {
      console.log("Touch start");
      moving = true;
      followFinger(event);
    });

    image.addEventListener("touchend", (event) => {
      event.preventDefault();
      console.log("Touch end");
      moving = false;
    });
  });

  if (options.stickyImage || (options.staticImage && options.hideImage)) {
    images.forEach((image) => {
      image.style.transition = `opacity ${options.transition}`;
      image.style.opacity = 0; // When the finger is no longer in the box, hide the image
      // Keep the image at its original size (no scaling)
      image.style.transform = "scale(1)";
    });
    hideImages();
    images.forEach((image) => {
      if (options.stickyImage) {
        image.style.transition = ""; // Remove CSS transition (fade)
        // TODO this hides the 'snapping' back
      }
      image.style.opacity = 0;
    });
    image = null; // Reset
  }
} else {
  // add mousemove (hover) event listener for desktop
  document.addEventListener("mousemove", followFinger);

  images.forEach((image) => {
    image.addEventListener("mousemove", (event) => {
      console.log("mousemove");
      moving = true;
      followFinger(event);
    });
  });
}
