import { useState, useEffect } from "react";
import React from "react";
import DefaultBackground from "../../components/DefaultBackground .js";

function CityBackground({ city }) {
  const accessKey = "tvEtJ43G3J-aCBk8r9f7UEF3Gfu5qbQmUcuGu34HV-I";
  const [backgroundUrl, setBackgroundUrl] = useState("");

  useEffect(() => {
    if (city) {
      fetch(
        `https://api.unsplash.com/search/photos?query=${city}&client_id=${accessKey}`
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          if (data.results.length > 0) {
            const imageUrl = data.results[0].urls.regular;

            setBackgroundUrl(imageUrl);
          } else {
            setBackgroundUrl("");
          }
        })
        .catch((error) => {
          console.log("Error:", error);
          setBackgroundUrl("");
        });
    }
  }, [city]);

  return (
    <div className="absolute top-0 left-0 w-full h-full">
      {backgroundUrl ? (
        <div
          className="w-full h-full bg-contain	  bg-center "
          style={{
            backgroundImage: `url(${backgroundUrl})`,
          }}
        ></div>
      ) : (
        <DefaultBackground/>
      )}
    </div>
  );
}

export default CityBackground;
