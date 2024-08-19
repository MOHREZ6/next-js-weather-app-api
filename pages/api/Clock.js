import { useState, useEffect, useRef } from "react";

function Clock({ lat, lon }) {
  const [time, setTime] = useState("");
  const intervalRef = useRef(null);

  useEffect(() => {
    const fetchTime = async () => {
      try {
        const TimeApiKey = "RLSGXSRRNDO3";
        const TimeZonesUrl =
          "https://api.timezonedb.com/v2.1/get-time-zone?format=json";

        const timeZoneResponse = await fetch(
          `${TimeZonesUrl}&key=${TimeApiKey}&by=position&lat=${lat}&lng=${lon}`
        );
        const timeZoneData = await timeZoneResponse.json();
        const timeZone = new Date(timeZoneData.formatted);
        setTime(timeZone.toLocaleTimeString());

        intervalRef.current = setInterval(() => {
          timeZone.setSeconds(timeZone.getSeconds() + 1);
          setTime(timeZone.toLocaleTimeString());
        }, 1000);
      } catch (error) {
        console.error("Error fetching the time data:", error);
      }
    };

    fetchTime();

    return () => clearInterval(intervalRef.current);
  }, [lat, lon]);

  return <p className="pb-6 font-bold	text-xl	">{time}</p>;
}

export default Clock;
