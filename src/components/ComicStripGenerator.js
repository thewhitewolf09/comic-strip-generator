import React, { useState } from "react";
import ComicPanel from "./ComicPanel";
import ComicStripForm from "./ComicStripForm";
import "./ComicStripGenerator.scss";
import comicImg from "..//../src/assets/Reading comics-pana.svg";
import { API_ENDPOINT, API_KEY } from "..//constants";

const ComicStripGenerator = () => {
  const [comicImages, setComicImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorTxt, setErrorTxt] = useState("");
  const [countPanel, setCountPanel] = useState(null);
  let cnt = 0;

  const query = async (data) => {
    try {
      const response = await fetch(API_ENDPOINT, {
        headers: {
          Accept: "image/png",
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(data),
      });
      const result = await response.blob();

      return result;
    } catch (error) {
      console.error("Error querying API:", error);
      setLoading(false);
      setErrorTxt("Failed to query API");
      throw new Error("Failed to query API");
    }
  };

  const handleFormSubmit = async (panelTexts) => {
    if (panelTexts.some((text) => !text.trim())) {
      console.error("Please fill in all panel texts.");
      setErrorTxt("Please fill in all panel texts.");
      return;
    }
    try {
      setLoading(true);
      setErrorTxt("");
      const images = await Promise.all(
        panelTexts.map(async (text) => {
          const image = await query({ inputs: text });

          if (image) {
            cnt += 1;
          }

          setCountPanel(cnt);

          return URL.createObjectURL(image);
        })
      );

      setComicImages(images);
      setCountPanel(null);
      setLoading(false);
    } catch (error) {
      console.error("Error generating comic strip:", error);
      setErrorTxt("Error generating comic strip");
      setLoading(false);
    }
  };

  const downloadComicStrip = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const panelWidth = 500;
    const panelHeight = 500;
    const margin = 10;
    const marginColor = "white";

    canvas.width = (panelWidth + margin) * 2;
    canvas.height = (panelHeight + margin) * 5;

    let loadedImages = 0;
    comicImages.forEach((image, index) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = image;
      img.onload = () => {
        loadedImages++;

        const x = (index % 2) * (panelWidth + margin);
        const y = Math.floor(index / 2) * (panelHeight + margin);

        ctx.fillStyle = marginColor;
        ctx.fillRect(x, y, panelWidth + margin, panelHeight + margin);

        ctx.drawImage(
          img,
          x + margin / 2,
          y + margin / 2,
          panelWidth,
          panelHeight
        );

        if (loadedImages === comicImages.length) {
          const dataURL = canvas.toDataURL("image/png");
          const downloadLink = document.createElement("a");
          downloadLink.href = dataURL;
          downloadLink.download = "comic_strip.png";
          downloadLink.click();
        }
      };
    });
  };

  return (
    <div className="comic-strip-generator">
      <div className="header">
        <h1>Comic Strip Generator</h1>
        <span>
          Unleash Your Imagination, One Panel at a Time! Create Your Story with
          Our Comic Strip Generator!
        </span>
      </div>

      <div className="form-container">
        <ComicStripForm onSubmit={handleFormSubmit} />
        <div className="comic-img-container">
          <img src={comicImg} alt="" />
        </div>
      </div>
      {errorTxt !== "" ? <p className="error-text">{errorTxt}</p> : null}

      {loading ? (
        <div className="loading-screen">
          <div class="bubble-loader">
            <div class="bubble"></div>
            <div class="bubble"></div>
            <div class="bubble"></div>
            <div class="bubble"></div>
            <div class="bubble"></div>
          </div>
          <span>Hold on! We're Sketching Your Comic Masterpiece...</span>
          {countPanel > 0 ? (
            <span className="panel-count">
              Cooking up something special for Panel {countPanel}!
            </span>
          ) : null}
        </div>
      ) : null}

      {comicImages?.length === 10 && loading === false ? (
        <>
          <h2 className="comic-response-text">
            Ta-da! Your Comic Strips Have Arrived!
          </h2>
          <div className="comic-strip">
            {comicImages.map((image, index) => (
              <ComicPanel key={index} image={image} />
            ))}
          </div>
          <button className="comic-download-btn" onClick={downloadComicStrip}>
            Download Comic Strip
          </button>
        </>
      ) : null}

      <footer>
        <p>&copy; 2023 ComicStrip Generator. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default ComicStripGenerator;
