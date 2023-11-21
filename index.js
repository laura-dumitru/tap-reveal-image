let options = {
  hotspots: {
    hs1: ["Img1", "cta1"],
    hs2: ["Img2", "cta2"],
    hs3: ["Img3", "cta3"],
  },
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

const imagesGroup = screen.find("Images");
const hotspotsGroup = screen.find("Hotspots");
const hotspotsArray = hotspotsGroup.content.objects;
const imagesArray = imagesGroup.content.objects;

const ctaGroup = screen.find("ctaGroup");
const ctaArray = ctaGroup.content.objects;
const arrow = screen.find("nextArrow") || screen.find("previousArrow");

function init() {
  // Loop over imagesGroup and hide each one with opacity 0
  function hideImages() {
    imagesArray.forEach((image) => image.setOpacity(0));
  }

  // Loop over all cta layers and hide when the ad loads
  function hideCtas() {
    ctaArray.forEach((cta) => cta.hideAction(ctx, {}, noop));
  }
  hideCtas();

  function showLastCta() {
    if (lastTouchedCta) {
      lastTouchedCta.showAction(ctx, {}, noop); // show the last touched CTA on touchend
    }
  }

  function followFinger(event) {
    event.preventDefault();

    if (mobile) {
      // For mobile, use touch event coordinates
      x = event.touches[0].clientX;
      y = event.touches[0].clientY;
    } else {
      // For desktop, use mouse event coordinates
      x = event.clientX;
      y = event.clientY;
    }

    // Position the image to the centre
    function positionImage(image, x, y) {
      const xOffset = x - options.offsetX;
      const yOffset = y - options.offsetY;
      // Calculate the position relative to the hotspot
      image.node.style.top = `calc(${yOffset}px - ${image.node.style.height} / 2)`;
      image.node.style.left = `calc(${xOffset}px - ${image.node.style.width}  / 2)`;
    }

    if (moving) {
      // if the user is touching or hovering the screen
      hotspotsArray
        .filter((hotspot) => hotspot instanceof Hotspot) // filtering out any layers that are not hotspots
        .forEach((hotspot) => {
          const hotspotsValues = options.hotspots[hotspot.name];

          image = screen.find(hotspotsValues[0]);
          image.node.style.transition = `opacity ${options.transition}`;

          // Calculating whether the finger is inside the boundaries of the hotspot
          const {
            left,
            right,
            top,
            bottom,
          } = hotspot.node.getBoundingClientRect();

          if (x >= left && x <= right && y >= top && y <= bottom) {
            // if I am in the boundaries of the box set the opacity of the image to 1
            image.setOpacity(1);
            lastTouchedCta = screen.find(hotspotsValues[1]);
            mediator(`User viewed image ${hotspotsValues[0]}`);
          } else if (options.hideImage) {
            //console.log("outside");
            image.setOpacity(0); // when finger no longer in the box hide image
          }

          if (options.stickyImage) {
            positionImage(image, x, y); //options.transition
          }
        });
    }
  }

  // add touchstart and touchend event listeners for mobile
  if (mobile) {
    document.addEventListener("touchmove", followFinger);

    hotspotsGroup.node.addEventListener("touchstart", (event) => {
      event.preventDefault();
      moving = true;
      followFinger(event);
    });

    hotspotsGroup.node.addEventListener("touchend", (event) => {
      event.preventDefault();
      moving = false;

      if (options.stickyImage || (options.staticImage && options.hideImage)) {
        imagesArray.forEach((image) => {
          image.node.style.transition = `opacity ${options.transition}`;
          image.setOpacity(0); // when finger no longer in the box hide image
          // Keep the image at its original size (no scaling)
          image.node.style.transform = "scale(1)";
        });
        hideImages();
        imagesArray.forEach((image) => {
          if (options.stickyImage) {
            image.node.style.transition = ""; // Remove CSS transition (fade)
            // TOOD this hides the 'snapping' back
          }
          image.setOpacity(0); // when finger no longer in the box hide image
        });
        image = null; // reset
      }
      hideCtas();
      showLastCta();
    });

    // add mousemove (hover) event listener for desktop
  } else {
    document.addEventListener("mousemove", followFinger);

    hotspotsGroup.node.addEventListener("mousemove", (event) => {
      //console.log("mousemove")
      moving = true;
      followFinger(event);
      hideCtas();
      showLastCta();
    });

    if (arrow) {
      arrow.node.addEventListener("click", (event) => {
        const page = unit.find(options.goToPage);
        unit.goToScreenAction(
          ctx,
          {
            screen: page,
            animation: {
              animation: options.animationType,
              duration: options.fadeDuration,
              direction: options.direction,
            },
          },
          noop
        );
      });
    }
  }
}
