let options = {
  stickyImage: false, // follows the user's finger
  staticImage: true, // stops on the screen when the user lets go, doesn't follow finger.
  hideImage: true, // shows the image after the finger leaves the hotspot. If sticky, this option should stay true.
  transition: "0.5s", // duration in seconds that it takes for the change from one image to another.
  offsetX: 0, // horizontal offset - value in pixels.It determines how far to the left or right of your thumb the image will appear.
  offsetY: 0, // vertical offset - value in pixels. It determines how far above or below your thumb the image will appear.
  products: ["google.com", "instagram.com", "facebook.com", "youtube.com"],
};

const regex = /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
const mobile = regex.test(navigator.userAgent);

const hotspots = Array.from(document.querySelectorAll(".grid .hotspot"));
const images = Array.from(document.querySelectorAll(".grid img"));
const cta = document.querySelector(".cta a");

// let lastTouchedCta = options.products[0];
let moving = false;
let x, y;
let image;

// Loop over images and hide each one with opacity 0
function hideImages() {
  images.forEach((image) => (image.style.opacity = 0));
}
hideImages();

function followFinger(event) {
  event.preventDefault();
  x = event.x; //clientX //layerX //movementX //offsetX //pageX //screenX
  y = event.y;

  function positionImage(image, x, y) {
    const hotspots = document.querySelectorAll(".hotspot");

    hotspots.forEach((hotspot) => {
      const hotspotRect = hotspot.getBoundingClientRect();

      // Calculate the position relative to the hotspot
      const offsetX = options.offsetX;
      const offsetY = options.offsetY;
      // Calculate the translation values to keep the image centered in the hotspot
      const xOffset = x - hotspotRect.left - offsetX;
      const yOffset = y - hotspotRect.top - offsetY;
      image.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    });
  }

  if (moving) {
    // Iterate over each hotspot to check if the finger is inside
    // const hotspot = hotspots.find() {
    hotspots.forEach(function (hotspot, index) {
      //if inside rect true else false
      const rect = hotspot.getBoundingClientRect();
      const image = images[index];
      image.style.transition = `opacity ${options.transition}`;

      if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
        image.style.opacity = 1;
      } else {
        if (options.hideImage) {
          image.style.opacity = 0;
        }
        if (options.stickyImage) {
          positionImage(image, x, y);
        }
      }
    });
  }
}

// add touchstart and touchend event listeners for mobile
if (mobile) {
  document.addEventListener("touchmove", followFinger);

  images.forEach((image, index) => {
    image.addEventListener("touchstart", (event) => {
      moving = true;
      followFinger(event);
    });

    image.addEventListener("touchend", (event) => {
      event.preventDefault();
      moving = false;
      cta.href = `https://${options.products[index]}`;
    });
  });
} else {
  // add mousemove (hover) event listener for desktop
  document.addEventListener("mousemove", followFinger);

  images.forEach((image, index) => {
    image.addEventListener("mousemove", (event) => {
      moving = true;
      cta.href = `https://${options.products[index]}`;
      followFinger(event);
    });
  });
}
