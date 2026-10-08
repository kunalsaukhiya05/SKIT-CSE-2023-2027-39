import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useSelector } from "react-redux";

const Classroom = () => {
  const { id } = useParams();
  const student = useSelector((state) => state?.student?.student);
  const teacher = useSelector((state) => state?.teacher?.teacher);

  const role = student ? "student" : teacher ? "teacher" : "guest";
  const userName = student?.fullName || teacher?.fullName || "Guest User";
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);
  const [error, setError] = useState("");
  
  const meetingRef = useRef(null);
  const zpRef = useRef(null);

  useEffect(() => {
    const checkOrientation = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };
    
    checkOrientation();
    window.addEventListener("resize", checkOrientation);
    
    return () => {
      window.removeEventListener("resize", checkOrientation);
    };
  }, []);

  useEffect(() => {
    const initMeeting = async () => {
      // Read credentials from environment variables
      const appID = parseInt(import.meta.env.VITE_ZEGOCLOUD_APP_ID);
      const serverSecret = import.meta.env.VITE_ZEGOCLOUD_SERVER_SECRET;

      if (!appID || !serverSecret) {
        setError("Video configuration missing. Please set VITE_ZEGOCLOUD_APP_ID and VITE_ZEGOCLOUD_SERVER_SECRET in your .env file.");
        return;
      }

      const userID = Date.now().toString();

      try {
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
          appID,
          serverSecret,
          id, // Use the actual room ID from URL params
          userID,
          userName
        );

        const zp = ZegoUIKitPrebuilt.create(kitToken);
        zpRef.current = zp;

        // Configure room settings based on role
        const config = {
          container: meetingRef.current,
          scenario: { mode: ZegoUIKitPrebuilt.VideoConference },
          showRoomTimer: true,
          showTextChat: true,
          showAudioVideoSettingsButton: true,
          showPinButton: true,
          showLayoutButton: true,
          showNonVideoUser: true,
          showOnlyAudioUser: true,
          turnOnMicrophoneWhenJoining: role === "teacher",
          turnOnCameraWhenJoining: role === "teacher",
          showScreenSharingButton: true,
          lowerLeftNotification: {
            showUserJoinAndLeave: true,
            showTextChat: true,
          },
        };

        // Teacher-specific settings
        if (role === "teacher") {
          config.showRoomDetailsButton = true;
          config.showInviteToCohostButton = true;
          config.showRemoveUserButton = true;
          config.sharedLinks = [
            { 
              name: "Class Link", 
              url: `${window.location.origin}/classroom/${id}` 
            },
          ];
        }

        zp.joinRoom(config);
      } catch (err) {
        console.error("Error initializing meeting:", err);
        setError("Failed to initialize video meeting. Please check your connection and try again.");
      }
    };

    if (id) {
      initMeeting();
    }

    return () => {
      if (zpRef.current) {
        zpRef.current.destroy();
      }
    };
  }, [id, userName, role]);

  // Custom fullscreen function
  const handleFullScreen = () => {
    const container = meetingRef.current || document.querySelector(".video-container");
    if (!container) return;

    if (!document.fullscreenElement) {
      if (container.requestFullscreen) {
        container.requestFullscreen()
          .then(() => setIsFullScreen(true))
          .catch((err) => console.error("Fullscreen error:", err));
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
          .then(() => setIsFullScreen(false))
          .catch((err) => console.error("Exit fullscreen error:", err));
      }
    }
  };

  // Handle orientation change for mobile
  const handleRotateScreen = () => {
    if (window.screen.orientation && window.screen.orientation.lock) {
      if (!isLandscape) {
        window.screen.orientation.lock("landscape")
          .then(() => setIsLandscape(true))
          .catch((err) => console.error("Orientation lock error:", err));
      } else {
        window.screen.orientation.lock("portrait")
          .then(() => setIsLandscape(false))
          .catch((err) => console.error("Orientation lock error:", err));
      }
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-xl p-8 max-w-lg text-center">
          <div className="text-red-400 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-white mb-3">Video Meeting Error</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <button
            onClick={() => window.history.back()}
            className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-screen h-screen bg-gray-900">
      {/* Header Bar */}
      <div className="absolute top-0 left-0 right-0 bg-gray-800 text-white p-2 z-10 flex justify-between items-center">
        <div className="flex items-center">
          <h2 className="text-sm md:text-lg font-semibold truncate max-w-[200px]">
            Classroom
          </h2>
          <span className="ml-2 md:ml-4 px-2 py-1 bg-blue-500 rounded text-xs">
            {role === "teacher" ? "Teacher" : "Student"}
          </span>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleFullScreen}
            className="bg-teal-600 hover:bg-teal-700 text-white px-2 md:px-3 py-1 rounded text-xs md:text-sm"
          >
            {isFullScreen ? "Exit ⛶" : "⛶ Full"}
          </button>
          {window.screen.orientation && (
            <button
              onClick={handleRotateScreen}
              className="bg-blue-600 hover:bg-blue-700 text-white px-2 md:px-3 py-1 rounded text-xs md:text-sm"
            >
              {isLandscape ? "↕" : "↔"}
            </button>
          )}
        </div>
      </div>

      {/* Video Container */}
      <div 
        ref={meetingRef} 
        className="w-full h-full bg-black pt-12 video-container"
        style={{ paddingTop: "3rem" }}
      ></div>
    </div>
  );
};

export default Classroom;