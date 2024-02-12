let options = {
  //mode: "sticky", // or static
  stickyImage: true, // follows the user's finger
  staticImage: false, // stops on the screen when the user lets go, doesn't follow finger.
  hideImage: false, // shows the image after the finger leaves the hotspot. If sticky, this option should stay true.
  transition: "0.5s", // duration in seconds that it takes for the change from one image to another.
  offsetX: 0, // horizontal offset - value in pixels.It determines how far to the left or right of your thumb the image will appear.
  offsetY: 0, // vertical offset - value in pixels. It determines how far above or below your thumb the image will appear.
  products: ["google.com", "instagram.com", "facebook.com", "youtube.com"],
};

lucide.createIcons();

const hotspots = Array.from(document.querySelectorAll(".grid .hotspot"));
const images = Array.from(document.querySelectorAll(".grid img"));
const cta = document.querySelector(".cta a");
const pointer = document.querySelector(".pointer");

let x, y;
let currentImage;
let animationComplete = false;

function animate() {
  const timeline = gsap.timeline();
  timeline.to(pointer, {
    x: "16vw",
    duration: 1,
    ease: "power1.inOut",
  });

  timeline.to(pointer, {
    y: "25vh",
    x: "0px",
    duration: 1,
    ease: "power1.inOut",
  });
  timeline.to(pointer, {
    x: "16vw",
    duration: 1,
    ease: "power1.inOut",
  });
  timeline.to(pointer, {
    opacity: 0,
    duration: 2, // Adjust duration as needed
    onComplete: function () {
      pointer.style.display = "none"; // Hide the pointer when animation ends
      animationComplete = true;
    },
  });
}
animate();
//if mobile animation should be different

// Loop over images and hide each one with opacity 0
images.forEach((image) => {
  image.style.opacity = 0;
  image.style.transition = `opacity ${options.transition}`;
});

function followFinger(event) {
  event.preventDefault();

  x = event.clientX; // Use clientX for mouse event or event.touches[0].clientX for touch event
  y = event.clientY; // Use clientY for mouse event or event.touches[0].clientY for touch event
  if (!animationComplete) return;
  //.clientX //.layerX //.offsetX //.pageX //.screenX //.x

  /*
  const index = images.indexOf(currentImage);
  const x = offset[index].x;
  const y = offset[index].y;
  */

  //const x = event.clientX / 4 - 200;
  //const y = event.clientY / 2 - 200;

  hotspots.forEach((hotspot, index) => {
    const { left, right, top, bottom } = hotspot.getBoundingClientRect();

    if (x >= left && x <= right && y >= top && y <= bottom) {
      currentImage = images[index];
      if (currentImage) currentImage.style.opacity = 1;
      cta.href = `https://${options.products[index]}`;
    }
  });

  //if (currentImage) currentImage.style.transform = `translate(${x}px, ${y}px)`; //calc()
}

// add mousemove (hover) event listener for desktop
document.addEventListener("pointermove", followFinger);

hotspots.forEach((hotspot, index) => {
  /*
  hotspot.addEventListener("pointerover", (event) => {
    event.preventDefault();
    currentImage = images[index];
    if (currentImage) currentImage.style.opacity = 1;
  });*/

  hotspot.addEventListener("pointerout", (event) => {
    event.preventDefault();
    if (options.hideImage && currentImage) currentImage.style.opacity = 0;

    cta.href = `https://${options.products[index]}`;
  });
});
