let options = {
  stickyImage: false, // follows the user's finger
  staticImage: true, //stops on the screen when the user lets go, doesn't follow finger.
  hideImage: false, // shows the image after the finger leaves the hotspot. If sticky, this option should stay true.
  transition: "0.5s", //duration in seconds that it takes for the change from one image to another.
  offsetX: 80, // horizontal offset - value in pixels.It determines how far to the left or right of your thumb the image will appear.
  offsetY: 60, //vertical offset - value in pixels. It determines how far above or below your thumb the image will appear.
  goToPage: "Page2", // match the name of the page layer it transitions to.
  fadeDuration: 750, // the time (in ms) it takes for page1 to transition to page2.
  animationType: "slide", // can be fade, slide or none.
  direction: "south", // can be north, south, east or west.
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
//hideImages();

function followFinger(event) {
  event.preventDefault();
  x = event.clientX;
  y = event.clientY;

  // Position the image to the centre
  function positionImage(image, x, y) {
    const xOffset = x - options.offsetX;
    const yOffset = y - options.offsetY;
    // Calculate the position relative to the container
    image.style.top = `calc(${yOffset}px - ${image.style.height} / 2)`;
    image.style.left = `calc(${xOffset}px - ${image.style.width}  / 2)`;
  }

  if (moving) {
    // FIXME figure out which hotspot/image the mouse is currently moving/within
    //hotspots.forEach((hotspot) => {})

    hotspot = hotspots[0];
    image = images[0];

    // Assuming image is the current image being handled
    image.style.transition = `opacity ${options.transition}`;

    // Calculating whether the finger is inside the boundaries of the hotspot
    const { left, right, top, bottom } = hotspot.getBoundingClientRect();
    // FIXME getBoundingClientRect is a celtra API function

    if (x >= left && x <= right && y >= top && y <= bottom) {
      // If I am in the boundaries of the box, set the opacity of the image to 1
      image.style.opacity = 0;
    } else if (options.hideImage) {
      // When the finger is no longer in the box, hide the image
      image.style.opacity = 0;
    }

    if (options.stickyImage) {
      positionImage(image, x, y); // options.transition
    }
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
