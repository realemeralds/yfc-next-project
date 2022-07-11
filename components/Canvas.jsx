import Image from "next/image";
import CanvasBackground from "../public/finalpixelart.jpg";
import React, { useRef, useEffect, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";

import styles from "../styles/Canvas.module.css";

import { io } from "socket.io-client";

const backendURL = "yfc-backend.herokuapp.com:80";

export default function Canvas() {
  const mainCanvasRef = useRef(null);
  const bgCanvasRef = useRef(null);
  const overlayCanvasRef = useRef(null);
  const breakButtonRef = useRef(null);
  const cancelButtonRef = useRef(null);
  const imgRef = useRef(null);
  let socket = useRef("");
  const [canvas, setCanvas] = useState();
  const [canvas2, setCanvas2] = useState();
  const [overlayCanvas, setOverlayCanvas] = useState();
  const [ctx, setCtx] = useState();
  const [ctx2, setCtx2] = useState();
  const [overlayContext, setOverlayContext] = useState();
  const [imgLoad, setImgLoad] = useState();
  const [clearRectArray, setClearRectArray] = useState();
  let tempArray;
  const [changed, setChanged] = useState(false);

  const width = 1002;
  const height = 802;

  useEffect(() => {
    setCanvas(mainCanvasRef.current);
    setCanvas2(bgCanvasRef.current);
    setOverlayCanvas(overlayCanvasRef.current);
  }, []);
  useEffect(() => {
    if (canvas && canvas2) {
      setCtx(canvas.getContext("2d"));
      setCtx2(canvas2.getContext("2d"));
      setOverlayContext(overlayCanvas.getContext("2d"));

      // Set canvas width
      canvas.width = width;
      canvas.height = height;
      canvas2.width = width;
      canvas2.height = height;
      overlayCanvas.width = width;
      overlayCanvas.height = height;
    }
    if (ctx && ctx2) {
      ctx2.fillStyle = "white";
      const breakButton = breakButtonRef.current;
      const cancelButton = cancelButtonRef.current;

      const pixelSize = 10;
      const padding = 1;

      var image = document.createElement("img");
      image.src = "/finalpixelart.jpg";
      var mouseOnCanvas = false;
      breakButton.disabled = true;
      cancelButton.disabled = true;
      let triggered = false;
      let drawn = false;

      // Overlay square position
      var overlaypos = {
        x: undefined,
        y: undefined,
      };
      // selected square position
      var selectpos = {
        x: undefined,
        y: undefined,
      };

      // Create the holes in the canvas based off clearRectArray
      const paintCanvas = (clearRectArray) => {
        let offset;
        if (clearRectArray) {
          // Create spots where image is revealed
          ctx.fillStyle = "white";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          // insert clear rectangles
          if (!drawn) {
            setTimeout(() => {
              ctx2.drawImage(
                imgRef.current,
                0,
                0,
                canvas.width - 1,
                canvas.height + 2
              );
            }, 1);
            drawn = true;
          }
          for (let i = 0; i < clearRectArray.length; i++) {
            offset = { sx: 0, sy: 0, ex: 0, ey: 0 };
            var clearRectCoords = clearRectArray[i];
            if (clearRectCoords[0] + pixelSize + padding == width) {
              offset.ex = 1;
            } else if (clearRectCoords[0] - 1 == 0) {
              offset.sx = -1;
              offset.ex = 1;
            }
            if (clearRectCoords[1] + pixelSize + padding == height) {
              offset.ey = 1;
            } else if (clearRectCoords[1] - 1 == 0) {
              offset.sy = -1;
              offset.ey = 1;
            }
            ctx.clearRect(
              clearRectCoords[0] + offset.sx,
              clearRectCoords[1] + offset.sy,
              pixelSize + offset.ex,
              pixelSize + offset.ey
            );
          }
        }
      };
      paintCanvas(clearRectArray);

      // return mouse positions on canvas
      function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect(), // abs. size of element
          scaleX = canvas.width / rect.width, // relationship bitmap vs. element for x
          scaleY = canvas.height / rect.height; // relationship bitmap vs. element for y
        return {
          x: (evt.clientX - rect.left) * scaleX, // scale mouse coordinates after they have
          y: (evt.clientY - rect.top) * scaleY, // been adjusted to be relative to element
        };
      }

      // paint canvas once array has been changed
      if (changed) {
        paintCanvas(clearRectArray);
        setChanged(false);
      }

      // Create a grey box when mousing over boxes
      // @param x: center x-coord of pixel
      // @param y: center y-coord of pixel
      const outlineElement = (x, y) => {
        // Create a grey background
        overlayContext.clearRect(0, 0, canvas.width, canvas.height);
        overlayContext.fillStyle = "#d0d0d0";
        overlayContext.fillRect(x - 1, y - 1, pixelSize + 1, pixelSize + 1);
        overlayContext.beginPath();
        overlayContext.moveTo(x + 3, y - 1);
        overlayContext.lineTo(x - 1, y - 1);
        overlayContext.lineTo(x - 1, y + 3);
        overlayContext.moveTo(x - 1, y + 7);
        overlayContext.lineTo(x - 1, y + 11);
        overlayContext.lineTo(x + 3, y + 11);
        overlayContext.moveTo(x + 7, y + 11);
        overlayContext.lineTo(x + 11, y + 11);
        overlayContext.lineTo(x + 11, y + 7);
        overlayContext.moveTo(x + 11, y + 3);
        overlayContext.lineTo(x + 11, y - 1);
        overlayContext.lineTo(x + 7, y - 1);
        overlayContext.strokeStyle = "rgba(0, 0, 0, 1)";
        overlayContext.lineWidth = 1;
        overlayContext.stroke();
      };

      // create a red box after clicking on one
      const selectedElement = (x, y) => {
        // Create a border of 1 px, length 2 px
        overlayContext.beginPath();
        overlayContext.moveTo(x + 3, y);
        overlayContext.lineTo(x, y);
        overlayContext.lineTo(x, y + 3);
        overlayContext.moveTo(x, y + 7);
        overlayContext.lineTo(x, y + 10);
        overlayContext.lineTo(x + 3, y + 10);
        overlayContext.moveTo(x + 7, y + 10);
        overlayContext.lineTo(x + 10, y + 10);
        overlayContext.lineTo(x + 10, y + 7);
        overlayContext.moveTo(x + 10, y + 3);
        overlayContext.lineTo(x + 10, y);
        overlayContext.lineTo(x + 7, y);
        overlayContext.strokeStyle = "red";
        overlayContext.lineWidth = 1;
        overlayContext.stroke();
      };

      var paintOverlays = (e) => {
        const { x, y } = getMousePos(canvas, e);

        if (2 < x && x < canvas.width - 2 && 2 < y && y < canvas.height - 2) {
          overlaypos.x = x - (x % 10) + 1; // +1 to compensate for padding
          overlaypos.y = y - (y % 10) + 1;
          if (
            clearRectArray &&
            JSON.stringify(clearRectArray).includes(
              `[${overlaypos.x},${overlaypos.y}]`
            )
          ) {
            removePos();
            return;
          }
          mouseOnCanvas = true;
        } else {
          removePos();
        }
        outlineElement(overlaypos.x, overlaypos.y);
        selectedElement(selectpos.x, selectpos.y);
      };

      const removePos = () => {
        overlaypos.x = undefined;
        overlaypos.y = undefined;
        mouseOnCanvas = false;
        paintCanvas(clearRectArray);
      };

      // Set upon click

      const localImgLoad = () => {
        if (ctx2 && imgRef.current && !drawn) {
          paintCanvas(clearRectArray);
          setImgLoad(() => {
            console.log("hi");
          });
        }
      };

      // Mount event listeners on load
      if (!triggered) {
        setImgLoad(localImgLoad(ctx2, imgRef.current, canvas));
        window.addEventListener("mousemove", (e) => {
          paintOverlays(e, canvas);
        });
        breakButton.addEventListener("click", () => {
          tempArray = clearRectArray;
          if (
            tempArray &&
            !JSON.stringify(tempArray).includes(
              JSON.stringify([selectpos.x, selectpos.y])
            )
          ) {
            tempArray.push([selectpos.x, selectpos.y]);
          }
          setClearRectArray(tempArray);
          socket.current.emit("canvasChange", selectpos.x, selectpos.y);
          selectpos.x = undefined;
          selectpos.y = undefined;
          breakButton.disabled = true;
          cancelButton.disabled = true;
        });
        window.addEventListener("mousedown", () => {
          if (mouseOnCanvas) {
            selectpos.x = overlaypos.x;
            selectpos.y = overlaypos.y;
            breakButton.disabled = false;
            cancelButton.disabled = false;
          }
          selectedElement(selectpos.x, selectpos.y);
        });
        cancelButton.addEventListener("click", () => {
          selectpos.x = undefined;
          selectpos.y = undefined;
        });
        triggered = true;
      }

      // TODO: remove debug functions below
      function checkAlignment(ctx, color) {
        const gap = 10;
        const padding = 1;
        ctx.lineWidth = 1;
        ctx.strokeStyle = color;
        for (var x = gap + padding; x <= width + padding; x += gap) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, width + 2 * padding);
          ctx.stroke();
        }
        for (var y = gap + padding; y <= height + padding; y += gap) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(height + 2 * padding, y);
          ctx.stroke();
        }
      }
    }
  }, [canvas, canvas2, ctx, ctx2, changed]);

  // Connect to backend
  useEffect(() => {
    socket.current = io(backendURL);
    if (!socket.current) {
      return;
    }
    socket.current.on("canvasUpdate", (...args) => {
      args[0] || clearRectArray ? () => {} : console.log("huh");
      JSON.stringify(args[0]) !== JSON.stringify(clearRectArray)
        ? setClearRectArray(args[0])
        : console.log("");
      // console.log(`canvasUpdate: ${JSON.stringify(args[0])}`);
      setChanged(true);
    });
  }, [backendURL]);

  return (
    <CanvasContainer>
      <CanvasWrapper zindex={0} daRef={bgCanvasRef} />
      <CanvasWrapper zindex={10} shadow daRef={mainCanvasRef} />
      <CanvasWrapper zindex={20} daRef={overlayCanvasRef} />
      <div className="flex flex-row space-x-10 absolute bottom-10 left-0 w-full justify-center">
        <CanvasButton icon={faCheck} text="Break" daRef={breakButtonRef} />
        <CanvasButton icon={faXmark} text="Break" daRef={cancelButtonRef} />
      </div>
      <div style={{ display: "none" }}>
        <img
          ref={imgRef}
          src="/finalpixelart.jpg"
          onLoad={imgLoad}
          width={750}
          height={600}
        />
      </div>
    </CanvasContainer>
  );
}

export const CanvasWrapper = ({ shadow, zindex, daRef }) => {
  return (
    <canvas
      ref={daRef}
      className={`z-${zindex} top-1/2 left-1/2 lg:w-[752px] lg:h-[602px] lg:block hidden -translate-x-[376px] -translate-y-[251px] absolute ${
        shadow ? styles.shadow : ""
      }`}
    />
  );
};

export const CanvasContainer = ({ children }) => {
  return (
    <div className="h-[150vh] w-full flex justify-center items-center bg-firstAccent relative">
      <p className="text-4xl absolute top-[10%] text-center m-auto text-white">
        Click the canvas below to find out more about dyslexia!
      </p>
      {children}
    </div>
  );
};

export const CanvasButton = ({ icon, text, daRef }) => {
  return (
    <button
      ref={daRef}
      className="bg-white shadow-md px-5 py-3 rounded-full disabled:bg-disabled flex flex-row align-center justify-center text-green-600 disabled:text-slate-500"
    >
      <FontAwesomeIcon icon={icon} size="lg" className="relative top-[7px]" />
      <span className="text-2xl whitespace-pre ml-3 ">{text}</span>
    </button>
  );
};