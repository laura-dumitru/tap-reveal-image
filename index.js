let options = {
  //mode: "sticky", // or static
  stickyImage: false, // follows the user's finger
  staticImage: true, // stops on the screen when the user lets go, doesn't follow finger.
  hideImage: false, // shows the image after the finger leaves the hotspot. If sticky, this option should stay true.
  transition: "0.5s", // duration in seconds that it takes for the change from one image to another.
  offsetX: 0, // horizontal offset - value in pixels.It determines how far to the left or right of your thumb the image will appear.
  offsetY: 0, // vertical offset - value in pixels. It determines how far above or below your thumb the image will appear.
  products: ["google.com", "instagram.com", "facebook.com", "youtube.com"],
};
lucide.createIcons();

const regex = /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
const mobile = regex.test(navigator.userAgent);

const hotspots = Array.from(document.querySelectorAll(".grid .hotspot"));
const images = Array.from(document.querySelectorAll(".grid img"));
const cta = document.querySelector(".cta a");
const pointer = document.querySelector(".pointer");

// let lastTouchedCta = options.products[0];
let moving = false;
let x, y;
let image;

function animate() {
  const timeline = gsap.timeline();
  timeline.to(pointer, {
    x: "300px",
    duration: 1,
    ease: "power1.inOut",
  });

  timeline.to(pointer, {
    y: "250px",
    x: "0px",
    duration: 1,
    ease: "power1.inOut",
  });
  timeline.to(pointer, {
    x: "300px",
    duration: 1,
    ease: "power1.inOut",
  });
  timeline.to(pointer, {
    opacity: 0,
    duration: 2, // Adjust duration as needed
    onComplete: function () {
      pointer.style.display = "none"; // Hide the pointer when animation ends
    },
  });
}
animate();

// Loop over images and hide each one with opacity 0
function hideImages() {
  images.forEach((image) => (image.style.opacity = 0));
}
hideImages();

images.forEach((image) => (image.style.transition = `opacity ${options.transition}`));

function repositionImage(image, x, y) {
  // const hotspotRect = hotspot.getBoundingClientRect();
  // Calculate the position relative to the hotspot
  // const offsetX = options.offsetX;
  // const offsetY = options.offsetY;
  // Calculate the translation values to keep the image centered in the hotspot
  // const xOffset = x - hotspotRect.left - offsetX;
  // const yOffset = y - hotspotRect.top - offsetY;
  //image.style.transform = `translate(${x - 400}px, ${y}px)`; //calc()
}

function followFinger(event) {
  event.preventDefault();
  x = event.x; //layerX //clientX //movementX //offsetX //pageX //screenX
  y = event.y;

  // console.log(hotspots);

  // if (moving) {
  // Iterate over each hotspot to check if the finger is inside
  // const hotspot = hotspots.find() {
  hotspots.forEach((hotspot, index) => {
    //if inside rect true else false
    const rect = hotspot.getBoundingClientRect();
    // console.log(index);
    //if (image) image.style.transition = `opacity ${options.transition}`;

    if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
      // if (options.staticImage || (options.stickyImage && !options.hideImage)) {
      //image = images[index];
      //image.style.opacity = 1;
      // }
      // console.log(`Finger is inside hotspot ${index}`);
    } //else if (image && options.hideImage) image.style.opacity = 0;
  });

  // if (options.stickyImage) repositionImage(image, x, y);
  // }
}

let currentImage;

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
  images.forEach((image, index) => {
    image.addEventListener("mouseover", (event) => {
      event.preventDefault();

      currentImage = images[index];

      // moving = true;
      //cta.href = `https://${options.products[index]}`;
      //followFinger(event);

      image.style.opacity = 1;
    });

    image.addEventListener("mouseout", (event) => {
      event.preventDefault();
      if (options.hideImage) image.style.opacity = 0;

      if (currentImage) currentImage.style.transform = `translate(0, 0)`; //calc()

      // moving = false;
      cta.href = `https://${options.products[index]}`;
      // console.log(cta.href);
      //
    });
  });

  // add mousemove (hover) event listener for desktop
  document.addEventListener("mousemove", (event) => {
    event.preventDefault();
    //followFinger);

    //x //layerX //clientX //movementX //offsetX //pageX //screenX
    const x = event.clientX / 4 - 200;
    const y = event.clientY / 2 - 200;

    console.log(x, y);

    if (currentImage) currentImage.style.transform = `translate(${x}px, ${y}px)`; //calc()
    // image.style.transform = `translate(${x}px, ${y}px)`; //calc()
  });
}
